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
    '@type': Stønadstype.LÆREMIDLER;
}

export type BehandlingFakta = BehandlingFaktaTilsynBarn | BehandlingFaktaLæremidler;
