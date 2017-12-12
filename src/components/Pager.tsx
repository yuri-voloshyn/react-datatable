import * as React from 'react';

export interface PagerProps {
    page: number;
    pageCount: number;
    onChangePage: (page: number) => void;
    showPages?: number;
}

class Pager extends React.Component<PagerProps> {

    public static defaultProps: Partial<PagerProps> = {
        showPages: 5
    };

    disableClick = (event: React.FormEvent<HTMLAnchorElement>) => event.preventDefault();

    changePage(page: number, event: React.FormEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.props.onChangePage(page);
    }

    renderPages() {
        const { page, pageCount, showPages } = this.props;

        const diff = Math.floor(showPages / 2);
        let start = Math.max(page - diff, 0);
        const end = Math.min(start + showPages, pageCount);

        if (pageCount >= showPages && end >= pageCount) {
            start = pageCount - showPages;
        }

        return Array(end - start).fill(null).map((item, index) => {
            const num = start + index + 1;
            const isActive = page === num;
            return (
                <li key={num} className={isActive ? 'active' : null}>
                    <a onClick={isActive ? this.disableClick : this.changePage.bind(this, num)}>
                        <span>{num}</span>
                    </a>
                </li >
            );
        });
    }

    render() {
        let { page, pageCount } = this.props;

        if (pageCount === 0) {
            return null;
        }

        if (page < 1) {
            page = 1;
        }

        const isFirst = page === 1;
        const isLast = page === pageCount;

        return (
            <ul className="pagination">
                <li key="first" className={isFirst ? 'disabled' : null}>
                    <a onClick={isFirst ? this.disableClick : this.changePage.bind(this, 1)}>
                        <span className="fa fa-angle-double-left" />
                    </a>
                </li>
                <li key="prev" className={isFirst ? 'disabled' : null}>
                    <a onClick={isFirst ? this.disableClick : this.changePage.bind(this, page - 1)}>
                        <span className="fa fa-angle-left" />
                    </a>
                </li>
                {this.renderPages()}
                <li key="next" className={isLast ? 'disabled' : null}>
                    <a onClick={isLast ? this.disableClick : this.changePage.bind(this, page + 1)}>
                        <span className="fa fa-angle-right" />
                    </a>
                </li>
                <li key="last" className={isLast ? 'disabled' : null}>
                    <a onClick={isLast ? this.disableClick : this.changePage.bind(this, pageCount)}>
                        <span className="fa fa-angle-double-right" />
                    </a>
                </li>
            </ul >
        );
    }
}

export default Pager;