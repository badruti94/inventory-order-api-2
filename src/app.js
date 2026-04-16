import express from 'express';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import requestId from './middlewares/requestId.js';
import productsRouter from './modules/product/product.route.js';
import ordersRouter from './modules/order/order.route.js';
import authRouter from './modules/auth/auth.route.js';
import docsRouter from './routes/docs.js';
import { logInfo } from './utils/logs.js';

const app = express();


// Middleware dasar
app.use(express.json());
app.use(requestId);

// Request logger sederhana (nanti bisa upgrade pakai requestId)
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - start;
        logInfo(req, 'HTTP Request', {
            statusCode: res.statusCode,
            durationMs,
        });
    });

    next();
});


// Health check
app.get('/health', (req, res) => {
    res.json({ success: true });
});

// Simulasi error untuk ngetes centralized handler
app.get('/boom', (req, res) => {
    throw new Error('Boom!');
});

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);
app.use('/docs', docsRouter);

// 404 + error handler harus paling bawah
app.use(notFound);
app.use(errorHandler);

export default app;