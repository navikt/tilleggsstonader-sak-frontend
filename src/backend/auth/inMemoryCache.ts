import { decodeJwt, JWTPayload } from 'jose';
import NodeCache from 'node-cache';

import { OboProvider } from './client';
import { secondsUntil } from './secondsUntil';
import logger from '../logger';

const cache = new NodeCache();
const NO_CACHE_TTL = 0;

const getSecondsToExpire = (payload: JWTPayload) =>
    Math.max(payload.exp ? secondsUntil(payload.exp) : NO_CACHE_TTL, NO_CACHE_TTL);

export function withInMemoryCache(oboProvider: OboProvider): OboProvider {
    return async (token, audience) => {
        const key = `${token}-${audience}`;
        const cachedToken = cache.get<string>(key);
        if (cachedToken) {
            logger.info(`Bruker token fra cache ttl=${getSecondsToExpire(decodeJwt(cachedToken))}`);
            return cachedToken;
        }
        logger.info('Utsteder nytt token');

        const oboToken = await oboProvider(token, audience);
        if (!oboToken) return null;

        const payload = decodeJwt(oboToken);
        const ttl = getSecondsToExpire(payload);
        if (ttl) {
            cache.set(key, oboToken, ttl - 30);
        }

        return oboToken;
    };
}
