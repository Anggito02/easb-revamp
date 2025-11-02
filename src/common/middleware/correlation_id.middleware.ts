import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export function CorrelationIdMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.headers['x-correlation-id'] || uuidv4();
        req['correlationId'] = id;
        res.setHeader('x-correlation-id', String(id));
        next();
    };
}
