import { decodeJwt, JWTPayload } from 'jose';
import NodeCache from 'node-cache';

import { OboProvider } from './client';
import { secondsUntil } from './secondsUntil';
import logger from '../logger';

const cache = new NodeCache();
const NO_CACHE_TTL = 0;

const getSecondsToExpire = (payload: JWTPayload) =>
    Math.max(payload.exp ? secondsUntil(payload.exp) : NO_CACHE_TTL, NO_CACHE_TTL);

export const withInMemoryCache =
    (oboProvider: OboProvider): OboProvider =>
    async (token, audience) => {
        const key = `${token}-${audience}`;
        const cachedToken = cache.get<string>(key);
        if (cachedToken) {
            return cachedToken;
        }

        const oboToken = await oboProvider(token, audience);
        if (!oboToken) {
            logger.error('Utstedt token er null');
            return null;
        }

        const payload = decodeJwt(oboToken);
        const ttl = getSecondsToExpire(payload);
        if (ttl) {
            // setter ttl minus 10s for å unngå at man bruker en cachet token som snart utløper
            cache.set(key, oboToken, ttl - 10);
        }

        return oboToken;
    };
