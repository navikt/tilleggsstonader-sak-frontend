import dotenv from 'dotenv';

import { envVar } from './utils';

if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}

export enum ApplicationName {
    sak = 'sak',
}
interface AzureSettings {
    client_id: string;
    client_secret: string;
    issuer: string;
    token_endpoint: string;
    openid_config_jwks_uri: string;
}

type ClientConfig = {
    [key in ApplicationName]: {
        url: string;
        audience: string;
    };
};

interface Miljø {
    builldPath: string;
    clients: ClientConfig;
    azure: AzureSettings;
}

const lokalAzure = (): AzureSettings => ({
    client_id: envVar('AZURE_APP_CLIENT_ID'),
    client_secret: envVar('AZURE_APP_CLIENT_SECRET'),
    issuer: 'https://login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851/v2.0',
    token_endpoint:
        'https://login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851/oauth2/v2.0/token',
    openid_config_jwks_uri:
        'https://login.microsoftonline.com/966ac572-f5b7-4bbe-aa88-c76419c0f851/discovery/v2.0/keys',
});

const devProdAzure = (): AzureSettings => ({
    client_id: envVar('AZURE_APP_CLIENT_ID'),
    client_secret: envVar('AZURE_APP_CLIENT_SECRET'),
    issuer: envVar('AZURE_OPENID_CONFIG_ISSUER'),
    token_endpoint: envVar('AZURE_OPENID_CONFIG_TOKEN_ENDPOINT'),
    openid_config_jwks_uri: envVar('AZURE_OPENID_CONFIG_JWKS_URI'),
});

const clientsLocal = (): ClientConfig => ({
    [ApplicationName.sak]: {
        url: 'http://localhost:8101/api',
        audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak-lokal',
    },
});

const clientsLocalPreprod = (): ClientConfig => ({
    [ApplicationName.sak]: {
        url: 'https://tilleggsstonader-sak.intern.dev.nav.no/api',
        audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak',
    },
});
const lokaltMiljø = (clients: ClientConfig): Miljø => ({
    builldPath: '../../dist_development',
    clients: clients,
    azure: lokalAzure(),
});

const devMiljø = (): Miljø => ({
    builldPath: '../../app/build',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://tilleggsstonader-sak/api',
            audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak',
        },
    },
    azure: devProdAzure(),
});

const prodMiljø = (): Miljø => ({
    builldPath: '../../app/build',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://tilleggsstonader-sak/api',
            audience: 'prod-gcp.tilleggsstonader.tilleggsstonader-sak',
        },
    },
    azure: devProdAzure(),
});

const initierMiljøvariabler = (): Miljø => {
    switch (process.env.ENV) {
        case 'localhost':
            return lokaltMiljø(clientsLocal());
        case 'localhost-preprod':
            return lokaltMiljø(clientsLocalPreprod());
        case 'preprod':
            return devMiljø();
        case 'prod':
            return prodMiljø();
        default:
            throw Error('Mangler miljøvariabel ENV');
    }
};

export const miljø = initierMiljøvariabler();
