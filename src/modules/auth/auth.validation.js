import {  z } from 'zod';

export const registerSchema = z.object({
    name: z.string('name is required').max(120),
    email: z.string('email is required').email('email must be valid').max(200),
    password: z.string('password is required').min(8, 'password min 8 chars').max(200).regex(/[0-9]/, 'must contain number'),
});

export const loginSchema = z.object({
    email: z.string('email is required').email('email must be valid').max(200),
    password: z.string('password is required').min(8, 'password min 8 chars').max(200),
});

export const refreshSchema = z.object({
    refreshToken: z.string('refreshToken is required'),
});