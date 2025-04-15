import { FaktaAktivtet } from './faktaAktivitet';
import { FaktaArena } from './faktaArena';
import { FaktaBarn } from './faktaBarn';
import { FaktaDokumentasjon } from './faktaDokumentasjon';
import { FaktaHovedytelse } from './faktaHovedytelse';
import { FaktaUtdanning } from './faktaUtdanning';
import { Stønadstype } from '../behandlingTema';

interface BehandlingFaktaInterface {
    søknadMottattTidspunkt?: string;
    hovedytelse: FaktaHovedytelse;
    arena?: FaktaArena;
    dokumentasjon?: FaktaDokumentasjon;
    '@type': Stønadstype;
}
export interface BehandlingFaktaTilsynBarn extends BehandlingFaktaInterface {
    aktivitet: FaktaAktivtet;
    barn: FaktaBarn[];
    '@type': Stønadstype.BARNETILSYN;
}

export interface BehandlingFaktaLæremidler extends BehandlingFaktaInterface {
    utdanning: FaktaUtdanning;
    alder?: number;
    '@type': Stønadstype.LÆREMIDLER;
}

class BoligEllerOvernatting {}
export interface Personopplysninger {
    adresse: Adresse;
}
export interface Adresse {
    gyldigFraOgMed: string;
    adresse: string;
    postnummer: string;
    poststed: string;
    landkode: string;
}

export interface BehandlingFaktaBoutgifter extends BehandlingFaktaInterface {
    aktiviteter: FaktaAktivtet;
    boligEllerOvernatting: BoligEllerOvernatting;
    dineOpplysninger: Personopplysninger;
    '@type': Stønadstype.BOUTGIFTER;
}

export type BehandlingFakta =
    | BehandlingFaktaTilsynBarn
    | BehandlingFaktaLæremidler
    | BehandlingFaktaBoutgifter;
