import logger from './logger';

export const envVar = (navn: string, påkrevd = true, defaultValue?: string): string => {
    const envVariable = process.env[navn];
    if (!envVariable && påkrevd && !defaultValue) {
        logger.error(`Mangler påkrevd miljøvariabel '${navn}'`);
        throw Error(`Mangler påkrevd miljøvariabel '${navn}'`);
    }
    if (!envVariable && defaultValue) {
        return defaultValue;
    } else {
        return envVariable as string;
    }
};
