import { FaktaAktivtet } from './faktaAktivitet';
import { FaktaBarn } from './faktaBarn';
import { FaktaDokumentasjon } from './faktaDokumentasjon';
import { FaktaHovedytelse } from './faktaHovedytelse';

export interface BehandlingFakta {
    søknadMottattTidspunkt?: string;
    hovedytelse: FaktaHovedytelse;
    aktivitet: FaktaAktivtet;
    barn: FaktaBarn[];
    dokumentasjon?: FaktaDokumentasjon;
}
