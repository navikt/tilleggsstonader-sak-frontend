import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Periode } from '../../utils/periode';
import { PeriodeStatus } from '../behandling/periodeStatus';

/**
 * TODO: Burde ikke ha muligheten for å ha "" som FaktiskMålgruppe eller AktivitetType
 * Lagt til som erstatning for null/undefined, da disse ikke er nullable i backend.
 * Kræsjer innlegging av vedtaksperioder i læremidler hvis de ikke er enten nullable eller "".
 **/
export interface Vedtaksperiode extends Periode {
    id: string;
    målgruppeType: FaktiskMålgruppe | '';
    aktivitetType: AktivitetType | '';
    status?: PeriodeStatus;
}
