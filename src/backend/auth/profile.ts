import { NextFunction, Request, RequestHandler, Response } from 'express';
import { decodeJwt } from 'jose';

import { getTokenFromHeader } from './secondsUntil';

export const getProfile = (): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            res.status(401).send();
            return next();
        }
        const payload = decodeJwt(token);
        // Enhet må hentes fra graph.microsoft, vi venter med den då vi ikke har bruk for den ennå
        res.status(200).send({
            groups: payload.groups ?? [],
            name: payload.name,
        });
    };
};
