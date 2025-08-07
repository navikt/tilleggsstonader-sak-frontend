import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Periode } from '../../utils/periode';
import { PeriodeStatus } from '../behandling/periodeStatus';

/**
 * Tillater at målgruppe og aktivitet kan være tomme strenger, slik at
 * de kan brukes i formen hvor man legger inn perioder og typene ikke er satt enda.
 **/
export interface Vedtaksperiode extends Periode {
    id: string;
    målgruppeType: FaktiskMålgruppe | '';
    aktivitetType: AktivitetType | '';
    status?: PeriodeStatus;
    vedtaksperiodeFraForrigeVedtak?: VedtaksperiodeFraForrigeVedtak;
}

export interface VedtaksperiodeFraForrigeVedtak extends Periode {
    id: string;
    målgruppeType: FaktiskMålgruppe | '';
    aktivitetType: AktivitetType | '';
}
