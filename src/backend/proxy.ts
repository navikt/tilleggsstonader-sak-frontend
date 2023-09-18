import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';

import logger from './logger';

export const addRequestInfo = (): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.headers['Nav-Consumer-Id'] = 'tilleggsstonader-sak-frontend';
        req.headers['nav-call-id'] = uuidv4();
        next();
    };
};

const restream = (proxyReq: ClientRequest, req: IncomingMessage) => {
    const requestBody = (req as Request).body;

    if (requestBody) {
        const bodyData = JSON.stringify(requestBody);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (context: string, targetUrl: string): RequestHandler => {
    return createProxyMiddleware(context, {
        changeOrigin: true,
        logLevel: 'info',
        logProvider: () => {
            return logger;
        },
        onProxyReq: restream,
        pathRewrite: (path: string) => {
            return path.replace(context, '');
        },
        secure: true,
        target: `${targetUrl}`,
    });
};
