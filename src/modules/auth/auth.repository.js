import { query } from '../../database/query.js';
import { User } from '../../database/models/index.js';

export async function findUserByEmail(email) {
    const sql = `
    SELECT id, name, email, password, role, created_at
    FROM users
    WHERE email = :email
    `;

    const rows = await query(sql, { replacements: { email }, plain: true }, 'findUserByEmail');
    return rows ?? null;
}

export async function createUser({ name, email, passwordHash, role = 'customer' }) {
    return await User.create(
        { name, email, password: passwordHash, role },
    );
}