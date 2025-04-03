import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Periode } from '../../utils/periode';
import { PeriodeStatus } from '../behandling/periodeStatus';

export interface Vedtaksperiode extends Periode {
    id: string;
    målgruppeType?: FaktiskMålgruppe;
    aktivitetType?: AktivitetType;
    status?: PeriodeStatus;
}
