import { query } from '../../database/query.js';
import { Product } from '../../database/models/index.js';
import { buildListQuery } from '../../utils/listQuery.js';


export async function createProduct({ name, price, stock }) {
    return await Product.create({ name, price, stock });
}

export async function getProductById(id) {
    const sql = `
    SELECT id, name, price, stock, created_at
    FROM products
    WHERE id = :id`;

    const rows = await query(sql, { replacements: { id }, plain: true }, 'getProductById');
    return rows ?? null;
}

export async function listProducts(validatedQuery) {
    const sql = `
        SELECT id, name, price, stock, created_at
        FROM products
    `;

    const countSql = `
        SELECT COUNT(*)::int AS count
        FROM products
    `;

    
    const { itemsSql, finalCountSql, replacements, page, limit } = buildListQuery({
        baseSql: sql,
        countSql,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        sort: validatedQuery.sort,
        sortMap: {
            name: 'name',
            created_at: 'created_at',
            price: 'price',
        },
        search: validatedQuery.search,
        searchField: validatedQuery.searchField,
        searchMap: {
            name: 'name',
        },
        filters: {
            minPrice: validatedQuery.minPrice,
            maxPrice: validatedQuery.maxPrice,
        },
        filterHandlers: {
            minPrice: (v) => ({ sql: 'price >= :minPrice', replacements: { minPrice: Number(v) } }),
            maxPrice: (v) => ({ sql: 'price <= :maxPrice', replacements: { maxPrice: Number(v) } }),
        },
    });

    
    const items = await query(itemsSql, {
        replacements,
    });
    const countRow = await query(finalCountSql, {
        replacements,
        plain: true
    });

    const totalItems = countRow?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return { products: items, meta: { page, limit, totalItems, totalPages } };
}

export async function updateProduct(id, payload) {
    const data = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.price !== undefined) data.price = payload.price;
    if (payload.stock !== undefined) data.stock = payload.stock;

    if (Object.keys(data).length === 0) return null;

    const [affected] = await Product.update(data, {
        where: { id },
    });

    if (affected === 0) return null;

    const updated = await Product.findByPk(id, {
        attributes: ['id', 'name', 'price', 'stock', 'created_at']
    });

    return updated ? updated.get({ plain: true }) : null;
}

export async function deleteProduct(id) {
    const deleted = await Product.destroy({
        where: { id },
    });

    if (deleted === 0) return null;

    return { id };
}