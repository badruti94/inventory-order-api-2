import { query } from '../../database/query.js';

export async function getUserById(id) {
    const sql = `
    SELECT id, role
    FROM users
    WHERE id = :id
    `;

    const rows = await query(
        sql,
        { replacements: { id }, plain: true },
        'getUserById'
    );

    return rows ?? null;
}