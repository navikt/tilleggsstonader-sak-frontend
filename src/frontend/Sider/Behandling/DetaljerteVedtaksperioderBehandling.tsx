import React, { JSX } from 'react';

import styles from './DetaljerteVedtaksperioderBehandling.module.css';
import { DetaljerteVedtaksperioder } from '../../hooks/useHentFullstendigVedtaksOversikt';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
import {
    DetaljertVedtaksperiodeBoutgifter,
    DetaljertVedtaksperiodeDagligReise,
    DetaljertVedtaksperiodeLæremidler,
    DetaljertVedtaksperiodeReiseTilSamling,
    DetaljertVedtaksperiodeTilsynBarn,
} from '../../typer/vedtak/vedtaksperiodeOppsummering';
import { VedtaksperioderOversiktBoutgifter } from '../Personoversikt/Vedtaksperioderoversikt/Boutgifter/VedtaksperioderOversiktBoutgifter';
import { VedtaksperioderOversiktDagligReise } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktDagligReise';
import { VedtaksperioderOversiktLæremidler } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktLæremidler';
import { VedtaksperioderOversiktReiseTilSamling } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktReiseTilSamling';
import { VedtaksperioderOversiktTilsynBarn } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktTilsynBarn';

type Props = {
    stønadstype: Stønadstype;
    vedtaksperioderOversiktForStønad: DetaljerteVedtaksperioder;
};

export function DetaljerteVedtaksperioderBehandling({
    stønadstype,
    vedtaksperioderOversiktForStønad,
}: Props) {
    const stønadstypeTilVedtaksperiodeOversikt: Record<
        Stønadstype,
        (data: DetaljerteVedtaksperioder) => JSX.Element
    > = {
        [Stønadstype.LÆREMIDLER]: (vedtaksperioder) => (
            <VedtaksperioderOversiktLæremidler
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeLæremidler[]}
            />
        ),
        [Stønadstype.BARNETILSYN]: (vedtaksperioder) => (
            <VedtaksperioderOversiktTilsynBarn
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeTilsynBarn[]}
            />
        ),
        [Stønadstype.BOUTGIFTER]: (vedtaksperioder) => (
            <VedtaksperioderOversiktBoutgifter
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeBoutgifter[]}
            />
        ),
        [Stønadstype.DAGLIG_REISE_TSO]: (vedtaksperioder) => (
            <VedtaksperioderOversiktDagligReise
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeDagligReise[]}
            />
        ),
        [Stønadstype.DAGLIG_REISE_TSR]: (vedtaksperioder) => (
            <VedtaksperioderOversiktDagligReise
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeDagligReise[]}
            />
        ),
        [Stønadstype.REISE_TIL_SAMLING_TSO]: (vedtaksperioder) => (
            <VedtaksperioderOversiktReiseTilSamling
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeReiseTilSamling[]}
            />
        ),
    };

    return (
        <div className={styles.tableContainer}>
            {stønadstypeTilVedtaksperiodeOversikt[stønadstype](vedtaksperioderOversiktForStønad)}
        </div>
    );
}
