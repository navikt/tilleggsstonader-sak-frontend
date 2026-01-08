import { Request, Response } from 'express';
import https from 'https';

import logger from './logger';

let sesjon: string | null = null;
let sesjonGyldigTil: number = 0; // epoch-tid

const hentSesjon = (): Promise<string> => {
    if (sesjon && Date.now() < sesjonGyldigTil) {
        return Promise.resolve(sesjon);
    }

    const apiKey = process.env.GOOGLE_MAPS_MAP_TILES_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_MAPS_MAP_TILES_API_KEY er ikke konfigurert');
    }

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.googleapis.com',
            port: 443,
            path: `/tile/v1/createSession?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        sesjon = response.session;
                        // Setter en fem minutters buffer på utløpstiden for å tvinge ny sesjon før den utløper
                        sesjonGyldigTil = parseInt(response.expiry) * 1000 - 5 * 60 * 1000;
                        resolve(response.session);
                    } catch (error) {
                        const feilmelding = 'Kunne ikke parse respons fra createSession';
                        logger.error(feilmelding, error);
                        reject(new Error(feilmelding));
                    }
                } else {
                    reject(new Error(`Kunne ikke opprette sesjon; ${res.statusCode} ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify({ mapType: 'roadmap', language: 'no', region: 'NO' }));
        req.end();
    });
};

export const tilesHandler = async (req: Request, res: Response): Promise<void> => {
    const { z, x, y } = req.params;
    if (!z || !x || !y) {
        res.status(400).send('Mangler lokasjonsparametere');
        return;
    }

    const apiKey = process.env.GOOGLE_MAPS_MAP_TILES_API_KEY;
    if (!apiKey) {
        logger.error('GOOGLE_MAPS_MAP_TILES_API_KEY mangler');
        res.status(500).end();
        return;
    }

    try {
        const sesjon = await hentSesjon();

        const options = {
            hostname: 'www.googleapis.com',
            port: 443,
            path: `/tile/v1/tiles/${z}/${x}/${y}?session=${sesjon}&key=${apiKey}`,
            method: 'GET',
        };

        const proxyReq = https.request(options, (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
                if (proxyRes.statusCode === 403) {
                    // Tving fornyet sesjon
                    sesjonGyldigTil = 0;
                }
                res.status(proxyRes.statusCode || 500).end();
                return;
            }

            res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (e) => {
            logger.error('Feil ved henting av kartflis', e);
            res.status(500).end();
        });

        proxyReq.end();
    } catch (error) {
        logger.error('Feil i tilesHandler', error);
        res.status(500).end();
    }
};
