import { FaktaReisemåte } from './faktaSamlinger';
import { JaNei } from '../../common';

export interface FaktaROAHAdresser {
    måBoBorteHjemmefra?: JaNei;
    periodeMidlertidigBosted?: FaktaROAHPeriodeMidlertidigBosted;
    adresseOriginaltBosted?: FaktaROAHOriginaltBosted;
    adresseMidlertidigBosted?: FaktaROAHAdresse;
}

export interface FaktaROAHPeriodeMidlertidigBosted {
    fomFlyttedato?: string;
    tomFlyttedato?: string;
}

export interface FaktaROAHOriginaltBosted {
    skalReiseFraFolkeregistrertAdresse?: JaNei;
    adresseOriginaltBosted?: FaktaROAHAdresse;
}

export interface FaktaROAHAdresse {
    gateadresse?: string;
    postnummer?: string;
    poststed?: string;
    landkode?: string;
}

export interface FaktaROAHBarnOgSærligeBehov {
    harBarnUnder18SomHarFlyttetMed?: JaNei;
    hvilkeBarnFlytterMed?: string[];
    harBarnHjemmeUnder4Klasse?: JaNei;
    harSærligeBehovForFlereHjemreiser?: JaNei;
}

export interface FaktaROAHReise {
    typeReise?: ROAHTypeReise;
    fom?: string;
    tom?: string;
    reisemåte?: FaktaReisemåte;
}

export type ROAHTypeReise = 'OPPSTART' | 'AVSLUTNING' | 'HJEMREISE';
