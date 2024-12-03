import React from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import VedtakshistorikkTilsynBarnTabellVisning, {
    Vedtaksperiode,
} from './VedtakshistorikkTilsynBarnTabellVisning';
import DataViewer from '../../../komponenter/DataViewer';
import { RessursStatus, RessursSuksess } from '../../../typer/ressurs';

const StyledVStack = styled(VStack)`
    max-width: 40rem;
`;

const dummyDataVedtakshistorikkTilsynBarnRessurs: RessursSuksess<Vedtaksperiode[]> = {
    status: RessursStatus.SUKSESS,
    data: [
        {
            fom: '2021-04-28T19:12:14.358Z',
            tom: '2021-06-28T19:12:14.358Z',
            aktivitet: 'Arbeidstrening',
            målgruppe: 'AAP',
            antallBarn: '2',
            utgift: '6000',
        },
        {
            fom: '2021-04-28T19:12:14.358Z',
            tom: '2021-06-28T19:12:14.358Z',
            aktivitet: 'Arbeidstrening',
            målgruppe: 'AAP',
            antallBarn: '2',
            utgift: '6000',
        },
        {
            fom: '2021-04-28T19:12:14.358Z',
            tom: '2021-06-28T19:12:14.358Z',
            aktivitet: 'Arbeidstrening',
            målgruppe: 'AAP',
            antallBarn: '2',
            utgift: '6000',
        },
    ],
};

export const VedtakshistorikkTilsynBarn = () => {
    return (
        <StyledVStack gap="4">
            <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
            <DataViewer
                response={{ dataVedtakshistorikk: dummyDataVedtakshistorikkTilsynBarnRessurs }}
            >
                {({ dataVedtakshistorikk }) => (
                    <VedtakshistorikkTilsynBarnTabellVisning data={dataVedtakshistorikk} />
                )}
            </DataViewer>
        </StyledVStack>
    );
};
