import { Request, Response } from 'express';

import logger from './logger';

const GOOGLE_AUTOCOMPLETE_URI = 'https://places.googleapis.com/v1/places:autocomplete';

export const autocompleteHandler = async (req: Request, res: Response): Promise<void> => {
    const { input } = req.body;

    if (!input) {
        res.status(400).json({ error: 'Mangler input til autocomplete' });
        return;
    }

    const apiKey = process.env.GOOGLE_MAPS_PLACES_API_KEY;

    if (!apiKey) {
        res.status(500).json({ error: 'Google Maps Places API-nøkkel er ikke konfigurert' });
        return;
    }

    const googleRequest: AutocompleteRequest = {
        input,
        includedRegionCodes: ['no'],
        languageCode: 'no',
        regionCode: 'no',
    };

    try {
        const response = await fetch(GOOGLE_AUTOCOMPLETE_URI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': '*',
            },
            body: JSON.stringify(googleRequest),
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`Google Places API error: ${response.status} ${errorText}`);
            res.status(response.status).json({ error: 'Feil mot Google Places API' });
            return;
        }

        const data = (await response.json()) as AutocompleteResponse;
        const forslag = data.suggestions?.map((s) => s.placePrediction.text.text) || [];

        res.header('Content-Type', 'application/json');
        res.json({ forslag });
    } catch (error) {
        logger.error('Error in autocomplete handler:', error);
        res.status(500).json({ error: 'Intern feil' });
    }
};

interface AutocompleteRequest {
    input: string;
    includedRegionCodes: string[];
    languageCode: string;
    regionCode: string;
}

interface AutocompleteResponse {
    suggestions?: Suggestion[];
}

interface Suggestion {
    placePrediction: PlacePrediction;
}

interface PlacePrediction {
    text: Text;
}

interface Text {
    text: string;
}
