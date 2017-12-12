import * as React from 'react';
import * as classNames from 'classnames';

export type DTSortDir = 'asc' | 'desc';

export interface DTSort {
    name: string;
    dir?: DTSortDir;
}

export interface DTColumn {
    name: string;
    title?: string;
    sortable?: boolean;
}

export interface DataTableProps<T> {
    columns: DTColumn[];
    data?: T[];
    sort?: DTSort;
    onChangeSort?: (sort: DTSort) => void;
}

class DataTable<T> extends React.Component<DataTableProps<T>> {

    clickHeader = (column: DTColumn) => {
        if (column.sortable === false || !this.props.onChangeSort) {
            return;
        }

        if (this.props.sort && (column.name === this.props.sort.name)) {
            if (this.props.sort.dir === 'desc') {
                this.props.onChangeSort(null);
            } else {
                this.props.onChangeSort({ name: column.name, dir: 'desc' });
            }
        } else {
            this.props.onChangeSort({ name: column.name, dir: 'asc' });
        }

    }

    renderHeader() {
        return this.props.columns.map(item => {
            const sortClasses = classNames({
                'fa': true,
                'fa-angle-up': this.props.sort && this.props.sort.dir !== 'desc',
                'fa-angle-down': this.props.sort && this.props.sort.dir === 'desc'
            });

            const sort = item.sortable !== false && this.props.sort && this.props.sort.name === item.name
                ? <i className={sortClasses} /> : null;

            return (
                <th
                    key={item.name}
                    className={classNames({
                        'sortable': item.sortable !== false,
                    })}
                    onClick={this.clickHeader.bind(this, item)}
                >{item.title} {sort}
                </th>
            );
        });
    }

    renderDataRow(row: T) {
        return this.props.columns.map(item => {
            const data = row[item.name];
            return (
                <td key={item.name}>{data}</td>
            );
        });
    }

    renderBody() {
        return this.props.data && this.props.data.map((item, index) => {
            return (
                <tr key={index}>{this.renderDataRow(item)}</tr>
            );
        });
    }

    render() {
        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {this.renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    {this.renderBody()}
                </tbody>
            </table>
        );
    }
}

export default DataTable;