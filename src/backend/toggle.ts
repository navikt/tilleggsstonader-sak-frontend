import { NextFunction, Request, RequestHandler, Response } from 'express';

import { AUTHORIZATION_HEADER, getUserIdFromToken } from './auth/token';
import logger from './logger';
import { miljø } from './miljø';

export const attachUnleashAuthToken =
    (): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            res.status(400).json({ detail: 'userId is required' });
            return;
        }

        if (req.query.userId && req.query.userId !== userId) {
            logger.error(`UserId på request=${req.query.userId} mens tokenUserId=${userId}`);
            res.status(400).json({ detail: 'Feil userId' });
            return;
        }
        const environment = miljø.unleash.environment;
        if (req.query.environment && req.query.environment !== environment) {
            logger.error(
                `Environment er feil på request=${req.query.environment} mens environment=${environment}`
            );
            res.status(400).json({ detail: 'Feil environment' });
            return;
        }
        req.headers[AUTHORIZATION_HEADER] = `Bearer ${miljø.unleash.token}`;
        next();
    };
