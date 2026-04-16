export function buildListQuery({
    baseSql,
    countSql,
    page = 1,
    limit = 10,
    sort,
    sortMap = {},
    search,
    searchField,
    searchMap = {},
    filters = {},
    filterHandlers = {},
}) {
    const where = [];
    const replacements = {};

    // search
    if (search && searchField) {
        const expression = searchMap[searchField];
        if (expression) {
            where.push(`${expression} ILIKE :search`);
            replacements.search = `%${search}%`;
        }
    }

    // filters
    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '') continue;
        const handlers = filterHandlers[key];
        if (!handlers) continue;
        const out = handlers(value);
        if (out?.sql) where.push(out.sql);
        Object.assign(replacements, out?.replacements ?? {});
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // sort
    let orderSql = '';
    if (sort) {
        const [fieldRaw, dirRaw] = String(sort).split(':');
        const expression = sortMap[fieldRaw];
        const dir = (dirRaw ?? 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
        if (expression) orderSql = `ORDER BY ${expression} ${dir}`;
    }

    // pagination
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const offset = (safePage - 1) * safeLimit;

    replacements.limit = safeLimit;
    replacements.offset = offset;


    const itemsSql = `
        ${baseSql}
        ${whereSql}
        ${orderSql}
        LIMIT :limit OFFSET :offset
    `;

    const finalCountSql = `
        ${countSql}
        ${whereSql}
    `;

    return {
        itemsSql,
        finalCountSql,
        replacements,
        page: safePage,
        limit: safeLimit,
    };
}