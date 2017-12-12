import { PagedData, DataModel } from '../models';
import { defaultPageSize } from '../consts';

let cachedData: DataModel[];

export async function getPagedData(params?: {
    page?: number,
    pageSize?: number,
    orderBy?: string,
    search?: string
}): Promise<PagedData<DataModel>> {
    if (!cachedData) {
        cachedData = await fetch('/data.json')
            .then(res => res.json());
    }

    let data = cachedData;

    const search = params && params.search;
    if (search && data.length) {
        data = data.filter(item =>
            Object.keys(item).some(key =>
                String(item[key]).toLowerCase().includes(search)
            )
        );
    }

    const orderBy = !params || !params.orderBy ? 'index asc' : params.orderBy;
    if (orderBy && data.length) {
        const arr = orderBy.split(' ');

        data = data.sort((a, b) => {
            const fv = arr[0];
            const av = a[fv];
            const bv = b[fv];
            const dv = arr.length > 1 && arr[1] === 'desc' ? -1 : 1;

            if (av < bv) {
                return -dv;
            } else if (av > bv) {
                return dv;
            } else {
                return 0;
            }
        });
    }

    const page = !params || !params.page || params.page < 1 ? 1 : params.page;
    const pageSize = !params || !params.pageSize ? defaultPageSize : params.pageSize;

    const totalCount = data.length;

    if (data.length) {
        data = data.slice((page - 1) * pageSize, page * pageSize);
    }

    return {
        totalCount: totalCount,
        data: data,
    };
}