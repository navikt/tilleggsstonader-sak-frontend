import { Request, Response } from 'express';

const GOOGLE_EMBEDDED_MAP_URI = 'https://www.google.com/maps/embed/v1/directions';

export const embeddedMapHandler = (req: Request, res: Response): void => {
    const { origin, destination, mode } = req.query;

    if (!origin || !destination || !mode) {
        res.status(400).json({
            error: 'Mangler påkrevde parametre: origin, destination, mode',
        });
        return;
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        res.status(500).json({
            error: 'Google Maps API-nøkkel er ikke konfigurert',
        });
        return;
    }

    const params = new URLSearchParams({
        key: apiKey,
        origin: String(origin),
        destination: String(destination),
        mode: String(mode),
    });

    const redirectUrl = `${GOOGLE_EMBEDDED_MAP_URI}?${params.toString()}`;
    res.redirect(redirectUrl);
};
