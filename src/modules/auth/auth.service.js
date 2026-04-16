import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import { ConflictError, UnauthorizedError } from '../../utils/AppError.js';
import * as repo from './auth.repository.js';
import * as userRepo from './user.repository.js';

function signAccessToken(payload) {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function signRefreshToken(payload) {
    return jwt.sign(payload, env.refreshTokenSecret, { expiresIn: env.refreshTokenExpiresIn });
}


export async function register({ name, email, password }) {
    const existing = await repo.findUserByEmail(email);
    if (existing) {
        throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

    const user = await repo.createUser({
        name,
        email,
        passwordHash,
        role: 'customer',
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, type: 'refresh' });

    return { user, accessToken, refreshToken };
}

export async function login({ email, password }) {
    const user = await repo.findUserByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
    };
    const refreshToken = signRefreshToken({ sub: safeUser.id, type: 'refresh' });

    return { user: safeUser, accessToken, refreshToken };
}

export async function refresh({ refreshToken }) {
    //verify signature
    let payload;
    try {
        payload = jwt.verify(refreshToken, env.refreshTokenSecret);
    } catch (error) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
        throw new UnauthorizedError('Invalid refresh token');
    }

    const newRefreshToken = signRefreshToken({ sub: payload.sub, type: 'refresh' });

    const user = await userRepo.getUserById(payload.sub);
    if (!user) throw new NotFoundError('User not found');
    const accessToken = signAccessToken({ sub: payload.sub, role: user.role });

    return { accessToken, refreshToken: newRefreshToken };
}