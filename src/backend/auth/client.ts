import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';
import { JWTVerifyGetKey } from 'jose/dist/types/jwt/verify';
import * as client from 'openid-client';
import {
    CryptoKey,
    modifyAssertion,
    TokenEndpointResponse,
    TokenEndpointResponseHelpers,
} from 'openid-client';

import logger from '../logger';
import { miljø } from '../miljø';

let cachedConfig: client.Configuration;

const generateCryptoKey = async (jwk: JsonWebKey): Promise<CryptoKey> =>
    await crypto.subtle.importKey(
        'jwk',
        jwk,
        {
            name: 'RSA-PSS', // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#supported_algorithms
            hash: { name: 'SHA-256' },
        },
        true,
        ['sign']
    );

export const getConfig = async (): Promise<client.Configuration> => {
    if (!cachedConfig) {
        if (miljø.azure.jwk) {
            const jwk = JSON.parse(miljø.azure.jwk!);
            const cryptoKey = await generateCryptoKey(jwk);

            cachedConfig = await client.discovery(
                new URL(miljø.azure.issuer),
                miljø.azure.client_id,
                {},
                client.PrivateKeyJwt({ key: cryptoKey, kid: jwk.kid }),
                { timeout: 5000 }
            );
        } else {
            cachedConfig = await client.discovery(
                new URL(miljø.azure.issuer),
                miljø.azure.client_id,
                miljø.azure.client_secret
            );
        }
    }
    return cachedConfig;
};

const utstedOnBehalfOfToken = async (
    subject_token: string,
    audience: string
): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> => {
    try {
        const config = await getConfig();
        const crypto = await client.randomDPoPKeyPair('RS256'); // TODO flytt til cache
        const dpoPHandle = client.getDPoPHandle(config, crypto, {
            [modifyAssertion]: (header, payload) => {
                payload['aud'] = 'yolo';
                payload['test'] = 'yolo';
            },
        });
        return await client.genericGrantRequest(
            config,
            'urn:ietf:params:oauth:grant-type:jwt-bearer',
            { scope: audience, assertion: subject_token, requested_token_use: 'on_behalf_of' },
            dpoPHandle
        );
    } catch (e) {
        logger.error('Feilet utstedelse av token', e);
        return Promise.reject('Feilet utstedelse av token');
    }
};

export type OboProvider = (token: string, audience: string) => Promise<string | null>;

let cachedRemoteJWKSet: JWTVerifyGetKey;
const remoteJWKSet = (): JWTVerifyGetKey => {
    if (!cachedRemoteJWKSet) {
        cachedRemoteJWKSet = createRemoteJWKSet(new URL(miljø.azure.openid_config_jwks_uri));
    }
    return cachedRemoteJWKSet;
};

export const azureOBO: OboProvider = async (token: string, audience: string): Promise<string> => {
    const tokenresponse = await utstedOnBehalfOfToken(token, audience);
    return tokenresponse.access_token ?? null;
};

export async function verify(token: string): Promise<JWTVerifyResult> {
    return await jwtVerify(token, remoteJWKSet(), {
        issuer: miljø.azure.issuer,
    });
}
