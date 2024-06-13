import { NextFunction, Request, Response } from 'express';

import { AUTHORIZATION_HEADER, getUserIdFromToken } from './auth/token';
import logger from './logger';
import { miljø } from './miljø';

export const attachUnleashAuthToken =
    () => async (req: Request, res: Response, next: NextFunction) => {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(400).json({ detail: 'userId is required' });
        }

        if (req.query.userId && req.query.userId !== userId) {
            logger.error(`UserId på request=${req.query.userId} mens tokenUserId=${userId}`);
            return res.status(400).json({ detail: 'Feil userId' });
        }
        const environment = miljø.unleash.environment;
        if (req.query.environment && req.query.environment !== environment) {
            logger.error(
                `Environment er feil på request=${req.query.environment} mens environment=${environment}`
            );
            return res.status(400).json({ detail: 'Feil environment' });
        }
        req.headers[AUTHORIZATION_HEADER] = `Bearer ${miljø.unleash.token}`;
        next();
    };
