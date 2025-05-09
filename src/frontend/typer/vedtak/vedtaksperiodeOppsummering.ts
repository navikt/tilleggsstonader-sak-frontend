import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

export interface VedtakperioderOversiktResponse {
    tilsynBarn: DetaljertVedtaksperiodeTilsynBarn[];
}

export type DetaljertVedtaksperiodeTilsynBarn = {
    fom: string;
    tom: string;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    antallBarn: number;
    totalMånedsUtgift: number;
};
