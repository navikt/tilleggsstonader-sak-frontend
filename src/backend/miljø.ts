import logger from './logger';

export enum ApplicationName {
    sak = 'sak',
}
interface Miljø {
    builldPath: string;
    clients: {
        [key in ApplicationName]: {
            url: string;
            audience: string;
        };
    };
    AZURE_OPENID_CONFIG_JWKS_URI?: string;
}

const lokaltMiljø: Miljø = {
    builldPath: '../../dist_development',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://localhost:8101/api',
            audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak-lokal',
        },
    },
    AZURE_OPENID_CONFIG_JWKS_URI:
        'https://login.microsoftonline.com/navq.onmicrosoft.com/discovery/v2.0/keys',
};

const devMiljø: Miljø = {
    builldPath: '../../app/build',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://tilleggsstonader-sak/api',
            audience: 'dev-gcp.tilleggsstonader.tilleggsstonader-sak',
        },
    },
};

const prodMiljø: Miljø = {
    builldPath: '../../app/build',
    clients: {
        [ApplicationName.sak]: {
            url: 'http://tilleggsstonader-sak/api',
            audience: 'prod-gcp.tilleggsstonader.tilleggsstonader-sak',
        },
    },
};

const initierMiljøvariabler = (): Miljø => {
    switch (process.env.ENV) {
        case 'localhost':
            return lokaltMiljø;
        case 'preprod':
            return devMiljø;
        case 'prod':
            return prodMiljø;
        default:
            logger.warn('Mangler miljøvariabler - setter lokale variabler');
            return lokaltMiljø;
    }
};

export const miljø = initierMiljøvariabler();
