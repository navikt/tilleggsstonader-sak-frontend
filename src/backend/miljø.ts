import dotenv from 'dotenv';

import logger from './logger';
import { envVar } from './utils';

if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}

/**
 * modiacontext brukes for å genere lenke til modiapersonoversikt
 */
export enum ApplicationName {
    sak = 'sak',
    klage = 'klage',
    modiacontext = 'modiacontext',
    unleash = 'unleash',
}

type Rolle =
    | 'veileder'
    | 'saksbehandler'
    | 'beslutter'
    | 'kode6'
    | 'kode7'
    | 'egenAnsatt'
    | 'NayUtland'
    | 'NayTilleggsstønader'
    | 'TiltaksenhetenTilleggsstønader';

type Roller = {
    [key in Rolle]: string;
};

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

interface UnleashSettings {
    token: string;
    environment: string;
}

interface Miljø {
    buildPath: string;
    clients: ClientConfig;
    azure: AzureSettings;
    unleash: UnleashSettings;
    roller: Roller;
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

/**
 * @param environment skal være den samme som i unleash-apitoken-preprod.yaml
 */
const unleash = (environment: 'mock' | 'development' | 'production'): UnleashSettings => ({
    token: environment !== 'mock' ? envVar('UNLEASH_SERVER_API_TOKEN') : 'mock',
    environment: environment,
});

const devRoller: Roller = {
    veileder: '3611981f-eda7-46ab-b8f2-50c3159e101c',
    saksbehandler: '31a99292-9461-40bf-b2d0-a815697dfbb4',
    beslutter: 'dab3f549-f5f0-4a9c-9f5b-1f6a15ae8424',
    kode6: '5ef775f2-61f8-4283-bf3d-8d03f428aa14',
    kode7: 'ea930b6b-9397-44d9-b9e6-f4cf527a632a',
    egenAnsatt: 'dbe4ad45-320b-4e9a-aaa1-73cca4ee124d',
    NayUtland: 'd5f850f4-90b7-41c1-a460-7ccca4bb171d',
    NayTilleggsstønader: 'e9696ba8-0572-4556-ab78-d8605cb6b0bf',
    TiltaksenhetenTilleggsstønader: 'a2a98575-4ef8-4244-ab3e-2d74de3db5bf',
};

const prodRoller: Roller = {
    veileder: '0f841c83-0d64-407c-80d5-4eb51dfaee1e',
    saksbehandler: 'c1e9edec-0c10-4df2-8c74-324ab9922220',
    beslutter: '224b5097-d0af-462c-8d8e-49c0e8a42661',
    kode6: 'ad7b87a6-9180-467c-affc-20a566b0fec0',
    kode7: '9ec6487d-f37a-4aad-a027-cd221c1ac32b',
    egenAnsatt: 'e750ceb5-b70b-4d94-b4fa-9d22467b786b',
    NayUtland: '71f94b2e-5c60-4f55-9db8-ce0235f4d5b8',
    NayTilleggsstønader: 'afd458bc-5b38-4b1a-81e1-35a35b5629f4',
    TiltaksenhetenTilleggsstønader: '3ee07ad5-b2b7-4067-9c9d-24db38a5791b',
};

const clientsLocal = (): ClientConfig => ({
    [ApplicationName.sak]: {
        url: 'http://localhost:8101/api',
        audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak-lokal',
    },
    [ApplicationName.klage]: {
        url: 'http://localhost:8090/api',
        audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-klage-lokal',
    },
    [ApplicationName.unleash]: {
        url: 'https://tilleggsstonader-unleash-api.nav.cloud.nais.io/api/frontend',
        audience: '',
    },
    [ApplicationName.modiacontext]: {
        url: 'https://modiacontextholder.intern.dev.nav.no/fnr-code/generate',
        audience: '',
    },
});

const clientsLocalPreprod = (): ClientConfig => ({
    [ApplicationName.sak]: {
        url: 'https://tilleggsstonader-sak.intern.dev.nav.no/api',
        audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak',
    },
    [ApplicationName.klage]: {
        url: 'https://tilleggsstonader-klage.intern.dev.nav.no/api',
        audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-klage',
    },
    [ApplicationName.unleash]: {
        url: 'https://tilleggsstonader-unleash-api.nav.cloud.nais.io/api/frontend',
        audience: '',
    },
    [ApplicationName.modiacontext]: {
        url: 'https://modiacontextholder.intern.dev.nav.no/fnr-code/generate',
        audience: '',
    },
});

const lokaltMiljø = (clients: ClientConfig): Miljø => {
    const brukUnleash = envVar('BRUK_UNLEASH', false, 'false');
    const unleashEnvironment = brukUnleash === 'true' ? 'development' : 'mock';
    logger.info(`Unleash, brukUnleash=${brukUnleash} unleashEnv=${unleashEnvironment}`);

    return {
        buildPath: '../../dist_development',
        clients: clients,
        azure: lokalAzure(),
        unleash: unleash(unleashEnvironment),
        roller: devRoller,
    };
};

const devMiljø = (): Miljø => ({
    buildPath: '../../app/build',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://tilleggsstonader-sak/api',
            audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak',
        },
        [ApplicationName.klage]: {
            url: 'http://tilleggsstonader-klage/api',
            audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-klage',
        },
        [ApplicationName.unleash]: {
            url: 'https://tilleggsstonader-unleash-api.nav.cloud.nais.io/api/frontend',
            audience: '',
        },
        [ApplicationName.modiacontext]: {
            url: 'https://modiacontextholder.intern.dev.nav.no/fnr-code/generate',
            audience: '',
        },
    },
    azure: devProdAzure(),
    unleash: unleash('development'),
    roller: devRoller,
});

const prodMiljø = (): Miljø => ({
    buildPath: '../../app/build',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://tilleggsstonader-sak/api',
            audience: 'prod-gcp.tilleggsstonader.tilleggsstonader-sak',
        },
        [ApplicationName.klage]: {
            url: 'http://tilleggsstonader-klage/api',
            audience: 'prod-gcp.tilleggsstonader.tilleggsstonader-klage',
        },
        [ApplicationName.unleash]: {
            url: 'https://tilleggsstonader-unleash-api.nav.cloud.nais.io/api/frontend',
            audience: '',
        },
        [ApplicationName.modiacontext]: {
            url: 'https://modiacontextholder.intern.nav.no/fnr-code/generate',
            audience: '',
        },
    },
    azure: devProdAzure(),
    unleash: unleash('production'),
    roller: prodRoller,
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
