import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    // Intercept res.json to log the response immediately
    res.json = function (body: any) {
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.socket.remoteAddress;
        
        let status = 'success';

        const logEntry = {
            timestamp,
            status,
            ip,
            method: req.method,
            path: req.path,
            query: req.query,
            responseBody: body
        };

        setImmediate(() => {
            if(res.statusCode >= 400) {
                if (body && typeof body.error === 'string' && body.error.includes('user_id')) {
                    logEntry.status = 'getset fail';
                } else {
                    logEntry.status = 'fail';
                }
            } 
            logger.info(logEntry);
            
        }); // reduce latency while sending the response  

        // Continue with the original response method
        return originalJson.call(res, body);
    };

    next();
};
