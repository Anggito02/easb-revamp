import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export function LoggerMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info({
                ts: new Date().toISOString(),
                method: req.method,
                path: req.originalUrl,
                status: res.statusCode,
                duration,
                correlationId: req['correlationId'],
            });
        });
        next();
    };
}
