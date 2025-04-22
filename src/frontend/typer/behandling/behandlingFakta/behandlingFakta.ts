import { FaktaAktivtet } from './faktaAktivitet';
import { FaktaArena } from './faktaArena';
import { FaktaBarn } from './faktaBarn';
import { FaktaDokumentasjon } from './faktaDokumentasjon';
import { FaktaHovedytelse } from './faktaHovedytelse';
import { FaktaUtdanning } from './faktaUtdanning';
import { Stønadstype } from '../behandlingTema';
import { FaktaBoligEllerOvernatting } from './faktaBoligEllerOvernattig';
import { FaktaPersonopplysninger } from './faktaPersonopplysninger';

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

export interface BehandlingFaktaBoutgifter extends BehandlingFaktaInterface {
    '@type': Stønadstype.BOUTGIFTER;
    aktiviteter: FaktaAktivtet;
    boligEllerOvernatting: FaktaBoligEllerOvernatting;
    personopplysninger: FaktaPersonopplysninger;
}

export type BehandlingFakta =
    | BehandlingFaktaTilsynBarn
    | BehandlingFaktaLæremidler
    | BehandlingFaktaBoutgifter;
