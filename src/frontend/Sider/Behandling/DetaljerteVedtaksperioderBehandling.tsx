import React, { JSX } from 'react';

import styled from 'styled-components';

import { Box } from '@navikt/ds-react';

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

const Container = styled('div')`
    margin-left: 2rem;
`;

const TableContainer = styled(Box)`
    width: 920px;
    background-color: white;
`;

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
        <Container>
            <TableContainer>
                {stønadstypeTilVedtaksperiodeOversikt[stønadstype](
                    vedtaksperioderOversiktForStønad
                )}
            </TableContainer>
        </Container>
    );
}
