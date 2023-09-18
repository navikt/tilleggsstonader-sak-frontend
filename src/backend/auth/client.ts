import { JWK } from 'jose';
import { Client, errors, GrantBody, GrantExtras, Issuer } from 'openid-client';

import logger from '../logger';

import OPError = errors.OPError;

export interface ClientConfig {
    issuer: string;
    token_endpoint: string;
    client_id: string;
    client_secret?: string;
    jwk: JWK;
}

const clientConfig: ClientConfig = {
    issuer: process.env.AZURE_OPENID_CONFIG_ISSUER as string,
    token_endpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT as string,
    client_id: process.env.AZURE_APP_CLIENT_ID as string,
    client_secret: process.env.AZURE_APP_CLIENT_SECRET as string,
    jwk: JSON.parse(process.env.AZURE_APP_JWK as string) as JWK,
};

const getIssuer = (): Issuer => {
    const { issuer, token_endpoint } = clientConfig;
    return new Issuer({
        issuer,
        token_endpoint,
        token_endpoint_auth_signing_alg_values_supported: ['RS256'],
    });
};

const getGrantBody = (subject_token: string, audience: string): GrantBody => ({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: subject_token,
    scope: audience,
    requested_token_use: 'on_behalf_of',
});

const createClient = (): Client => {
    const { jwk, client_id, client_secret } = clientConfig;
    const issuer = getIssuer();
    return new issuer.Client(
        {
            client_id,
            client_secret,
            token_endpoint_auth_method: 'client_secret_basic',
        },
        { keys: [jwk] }
    );
};

const client = createClient();

const getAdditionalClaims = (): GrantExtras => {
    const { token_endpoint } = clientConfig;
    const now = Math.floor(Date.now() / 1000);
    return {
        clientAssertionPayload: {
            nbf: now,
            aud: token_endpoint,
        },
    };
};

const tokenExchange = async (
    client: Client,
    grantBody: GrantBody,
    additionalClaims: GrantExtras
): Promise<string | null> => {
    try {
        const tokenset = await client.grant(grantBody, additionalClaims);
        return tokenset.access_token ?? null;
    } catch (e) {
        if (e instanceof OPError) logger.warn(e.message, e.response?.body || '');
        throw e;
    }
};

export type OboProvider = (token: string, audience: string) => Promise<string | null>;

export const azureOBO: OboProvider = (token: string, audience: string) =>
    tokenExchange(client, getGrantBody(token, audience), getAdditionalClaims());
