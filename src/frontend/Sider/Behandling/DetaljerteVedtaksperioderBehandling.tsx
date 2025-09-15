import React from 'react';

import styled from 'styled-components';

import { Box } from '@navikt/ds-react';
import { AGray500 } from '@navikt/ds-tokens/dist/tokens';

import { useHentFullstendigVedtaksOversikt } from '../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling } from '../../typer/behandling/behandling';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
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
    border: solid 1px ${AGray500};
`;

type Props = {
    behandling: Behandling;
};

export function DetaljerteVedtaksperioderBehandling({ behandling }: Props) {
    const { vedtaksperioderOversikt } = useHentFullstendigVedtaksOversikt(
        behandling.fagsakPersonId
    );

    return (
        <Container>
            <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversikt }}>
                {({ vedtaksperioderOversikt }) => {
                    switch (behandling.stønadstype) {
                        case Stønadstype.BOUTGIFTER:
                            return vedtaksperioderOversikt.boutgifter.length > 0 ? (
                                <TableContainer>
                                    <VedtaksperioderOversiktBoutgifter
                                        vedtaksperioder={vedtaksperioderOversikt.boutgifter}
                                    />
                                </TableContainer>
                            ) : null;

                        case Stønadstype.BARNETILSYN:
                            return vedtaksperioderOversikt.tilsynBarn.length > 0 ? (
                                <TableContainer>
                                    <VedtaksperioderOversiktTilsynBarn
                                        vedtaksperioder={vedtaksperioderOversikt.tilsynBarn}
                                    />
                                </TableContainer>
                            ) : null;

                        case Stønadstype.LÆREMIDLER:
                            return vedtaksperioderOversikt.læremidler.length > 0 ? (
                                <TableContainer>
                                    <VedtaksperioderOversiktLæremidler
                                        vedtaksperioder={vedtaksperioderOversikt.læremidler}
                                    />
                                </TableContainer>
                            ) : null;

                        case Stønadstype.DAGLIG_REISE_TSO:
                            return vedtaksperioderOversikt.dagligReiseTso.length > 0 ? (
                                <TableContainer>
                                    <VedtaksperioderOversiktDagligReiseTso
                                        vedtaksperioder={vedtaksperioderOversikt.dagligReiseTso}
                                    />
                                </TableContainer>
                            ) : null;

                        case Stønadstype.DAGLIG_REISE_TSR:
                            return vedtaksperioderOversikt.dagligReiseTsr.length > 0 ? (
                                <TableContainer>
                                    <VedtaksperioderOversiktDagligReiseTsr
                                        vedtaksperioder={vedtaksperioderOversikt.dagligReiseTsr}
                                    />
                                </TableContainer>
                            ) : null;
                    }
                }}
            </DataViewer>
        </Container>
    );
}
