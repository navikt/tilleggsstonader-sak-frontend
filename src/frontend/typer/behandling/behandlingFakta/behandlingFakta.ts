import { FaktaAktivtet } from './faktaAktivitet';
import { FaktaBarn } from './faktaBarn';
import { FaktaHovedytelse } from './faktaHovedytelse';

export interface BehandlingFakta {
    hovedytelse: FaktaHovedytelse;
    aktivitet: FaktaAktivtet;
    barn: FaktaBarn[];
}
