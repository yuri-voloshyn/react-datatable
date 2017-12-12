import * as React from 'react';
import { DataTable, DTColumn, DTSort, Pager } from './components';
import { DataModel } from './models';
import { getPagedData } from './api';
import { defaultPageSize } from './consts';
import debounce from 'debounce';
import './App.css';

const logo = require('./logo.svg');

const columns: DTColumn[] = [
    { name: 'index', title: 'Index' },
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    { name: 'age', title: 'Age' },
    { name: 'email', title: 'Email' },
    { name: 'phone', title: 'Phone' },
    { name: 'address', title: 'Address', sortable: false },
];

interface ComponentState {
    totalCount?: number;
    data?: DataModel[];
    page: number;
    pageSize: number;
    sort?: DTSort;
    search?: string;
}

class App extends React.Component<{}, ComponentState> {

    state: ComponentState = {
        page: 1,
        pageSize: defaultPageSize,
    };

    _unmounted: boolean = false;

    delayedChangeSearch = debounce(
        (event: React.FormEvent<HTMLInputElement>) => {
            if (this._unmounted) {
                return;
            }

            this.setState(
                { page: 1, search: (event.target as HTMLInputElement).value },
                () => this.loadData());
        },
        300);

    componentWillMount() {
        this.loadData();
    }

    componentWillUnmount() {
        this._unmounted = true;
    }

    loadData = () => {
        const { page, pageSize, sort, search } = this.state;
        const orderBy = sort && (sort.name + (sort.dir && ' ' + sort.dir));

        getPagedData({ page, pageSize, orderBy, search })
            .then(res => {
                if (this._unmounted) {
                    return;
                }

                this.setState(res);
            });
    }

    changePageSize = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState(
            { page: 1, pageSize: Number.parseInt(event.currentTarget.value) },
            () => this.loadData());
    }

    changePage = (page: number) => {
        this.setState(
            { page: page },
            () => this.loadData());
    }

    changeSort = (sort: DTSort) => {
        this.setState(
            { sort },
            () => this.loadData());
    }

    changeSearch = (event: React.FormEvent<HTMLInputElement>) => {
        event.persist();
        this.delayedChangeSearch(event);
    }

    render() {
        const { totalCount, data, page, pageSize, sort } = this.state;
        const pageCount = !!totalCount ? Math.ceil(totalCount / pageSize) : 0;

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>React DataTable example</h2>
                </div>
                <div className="app-body">
                    <div className="app-datapanel">
                        <div className="app-datapanel__search">
                            <label>Search: </label>
                            <input type="search" onChange={this.changeSearch} />
                        </div>
                        <div className="app-datapanel__pagesize">
                            <label>Page size: </label>
                            <select onChange={this.changePageSize} value={pageSize}>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className="app-datapanel__pager">
                            <Pager
                                page={page}
                                pageCount={pageCount}
                                onChangePage={this.changePage}
                            />
                        </div>
                    </div>
                    <div>
                        <DataTable
                            columns={columns}
                            data={data}
                            sort={sort}
                            onChangeSort={this.changeSort}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
