import { Request } from 'express';

const getNow = (timestamp: number): number => {
    const now = Date.now();
    if (Math.abs(now - timestamp) < Math.abs(now - timestamp * 1000)) {
        return now;
    } else {
        return Math.round(now / 1000);
    }
};

export const secondsUntil = (timestamp: number): number => {
    if (timestamp <= 0) return 0;
    const now = getNow(timestamp);
    if (timestamp <= now) return 0;
    return Math.round(timestamp - now);
};

export const getTokenFromHeader = (req: Request): string | null => {
    if (process.env.NODE_ENV === 'development') {
        // @ts-ignore lokalt lagres accessToken i sessionen for å kunne logge inn uten wonderwall
        return req.session.tokenSet?.access_token;
    }
    const { authorization } = req.headers;
    if (authorization == null) return null;
    if (!authorization.includes('Bearer ')) {
        return null;
    }
    return authorization.split(' ')[1];
};
