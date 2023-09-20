import logger from './logger';

interface Miljø {
    builldPath: string;
    backend: string;
}

const lokaltMiljø: Miljø = {
    builldPath: '../../dist_development',
    backend: 'http://localhost:8101/api',
};

const devMiljø: Miljø = {
    builldPath: '../../app/build',
    backend: 'http://tilleggsstonader-sak/api',
};

const prodMiljø: Miljø = {
    builldPath: '../../app/build',
    backend: 'http://tilleggsstonader-sak/api',
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
