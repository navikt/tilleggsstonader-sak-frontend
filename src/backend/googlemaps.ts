import { Request, RequestHandler, Response } from 'express';

import { envVar } from './utils';

export const returnGoogleMapsApiKey =
    (): RequestHandler => async (_req: Request, res: Response) => {
        res.status(200).json({ apiKey: envVar('GOOGLE_MAPS_API_KEY') });
    };
