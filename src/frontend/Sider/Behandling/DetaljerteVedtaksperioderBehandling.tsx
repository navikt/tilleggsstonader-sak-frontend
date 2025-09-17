import React, { JSX } from 'react';

import styled from 'styled-components';

import { Box } from '@navikt/ds-react';
import { AGray500 } from '@navikt/ds-tokens/dist/tokens';

import { useHentFullstendigVedtaksOversiktForStønad } from '../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling } from '../../typer/behandling/behandling';
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
    border: solid 1px ${AGray500};
`;

const Feilmelding = styled('p')`
    margin-left: '1rem';
`;

type Props = {
    behandling: Behandling;
};

type VedtaksperiodeData =
    | DetaljertVedtaksperiodeLæremidler[]
    | DetaljertVedtaksperiodeBoutgifter[]
    | DetaljertVedtaksperiodeTilsynBarn[]
    | DetaljertVedtaksperiodeDagligReiseTso[]
    | DetaljertVedtaksperiodeDagligReiseTsr[];

export function DetaljerteVedtaksperioderBehandling({ behandling }: Props) {
    const { vedtaksperioderOversiktForStønad } =
        useHentFullstendigVedtaksOversiktForStønad(behandling);

    const stønadstypeMap = new Map<Stønadstype, (data: VedtaksperiodeData) => JSX.Element>([
        [
            Stønadstype.LÆREMIDLER,
            (vedtaksperioder) => (
                <VedtaksperioderOversiktLæremidler
                    vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeLæremidler[]}
                />
            ),
        ],
        [
            Stønadstype.BARNETILSYN,
            (vedtaksperioder) => (
                <VedtaksperioderOversiktTilsynBarn
                    vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeTilsynBarn[]}
                />
            ),
        ],
        [
            Stønadstype.BOUTGIFTER,
            (vedtaksperioder) => (
                <VedtaksperioderOversiktBoutgifter
                    vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeBoutgifter[]}
                />
            ),
        ],
        [
            Stønadstype.DAGLIG_REISE_TSO,
            (vedtaksperioder) => (
                <VedtaksperioderOversiktDagligReiseTso
                    vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeDagligReiseTso[]}
                />
            ),
        ],
        [
            Stønadstype.DAGLIG_REISE_TSR,
            (vedtaksperioder) => (
                <VedtaksperioderOversiktDagligReiseTsr
                    vedtaksperioder={vedtaksperioder as DetaljertVedtaksperiodeDagligReiseTsr[]}
                />
            ),
        ],
    ]);
    const relevantePerioder = stønadstypeMap.get(behandling.stønadstype);

    return (
        <Container>
            <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversiktForStønad }}>
                {({ vedtaksperioderOversiktForStønad }) => {
                    return (
                        <TableContainer>
                            <TableContainer>
                                {relevantePerioder ? (
                                    relevantePerioder(vedtaksperioderOversiktForStønad)
                                ) : (
                                    <Feilmelding>
                                        Bruker har ingen tidligere vedtaksperioder i TS-sak
                                    </Feilmelding>
                                )}
                            </TableContainer>
                        </TableContainer>
                    );
                }}
            </DataViewer>
        </Container>
    );
}
