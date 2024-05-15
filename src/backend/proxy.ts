import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';

import { ApplicationName, miljø } from './miljø';

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

export const doProxy = (
    applicationName: ApplicationName,
    pathRewrite?: { [regexp: string]: string }
): RequestHandler => {
    return createProxyMiddleware({
        target: `${miljø.clients[applicationName].url}`,
        changeOrigin: true,
        secure: true,
        logger: console,
        on: {
            proxyReq: restream,
        },
        pathRewrite: pathRewrite,
    });
};
