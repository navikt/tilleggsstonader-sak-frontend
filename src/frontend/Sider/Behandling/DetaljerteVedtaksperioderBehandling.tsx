import React, { JSX } from 'react';

import styles from './DetaljerteVedtaksperioderBehandling.module.css';
import { DetaljerteVedtaksperioder } from '../../hooks/useHentFullstendigVedtaksOversikt';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
import {
    DetaljertVedtaksperiodeBoutgifter,
    DetaljertVedtaksperiodeDagligReiseTso,
    DetaljertVedtaksperiodeDagligReiseTsr,
    DetaljertVedtaksperiodeLæremidler,
    DetaljertVedtaksperiodeTilsynBarn,
} from '../../typer/vedtak/vedtaksperiodeOppsummering';
import { VedtaksperioderOversiktBoutgifter } from '../Personoversikt/Vedtaksperioderoversikt/Boutgifter/VedtaksperioderOversiktBoutgifter';
import { VedtaksperioderOversiktDagligReiseTso } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktDagligReiseTso';
import { VedtaksperioderOversiktDagligReiseTsr } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktDagligReiseTsr';
import { VedtaksperioderOversiktLæremidler } from '../Personoversikt/Vedtaksperioderoversikt/VedtaksperioderOversiktLæremidler';
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
            <VedtaksperioderOversiktDagligReiseTso
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeDagligReiseTso[]}
            />
        ),
        [Stønadstype.DAGLIG_REISE_TSR]: (vedtaksperioder) => (
            <VedtaksperioderOversiktDagligReiseTsr
                border={true}
                vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeDagligReiseTsr[]}
            />
        ),
    };

    return (
        <div className={styles.tableContainer}>
            {stønadstypeTilVedtaksperiodeOversikt[stønadstype](vedtaksperioderOversiktForStønad)}
        </div>
    );
}
