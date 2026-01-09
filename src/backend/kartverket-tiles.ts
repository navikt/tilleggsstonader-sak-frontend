import { Request, Response } from 'express';
import https from 'https';

import logger from './logger';

// Kartverket bruker {z}/{y}/{x} i stedet for {z}/{x}/{y}
export const kartverketTilesHandler = async (req: Request, res: Response): Promise<void> => {
    const { z, x, y } = req.params;
    if (!z || !x || !y) {
        res.status(400).send('Mangler lokasjonsparametere');
        return;
    }

    try {
        const options = {
            hostname: 'cache.kartverket.no',
            port: 443,
            path: `/v1/wmts/1.0.0/topo/default/utm33n/${z}/${y}/${x}.png`,
            method: 'GET',
        };

        const proxyReq = https.request(options, (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
                res.status(proxyRes.statusCode || 500).end();
                return;
            }

            res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (e) => {
            logger.error('Feil ved henting av kartflis fra kartverket', e);
            res.status(500).end();
        });

        proxyReq.end();
    } catch (error) {
        logger.error('Feil i kartverketTilesHandler', error);
        res.status(500).end();
    }
};
