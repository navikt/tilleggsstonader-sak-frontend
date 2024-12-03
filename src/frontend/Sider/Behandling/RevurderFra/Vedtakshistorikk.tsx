import React from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import VedtakshistorikkTabellVisning, { Vedtaksperiode } from './VedtakshistorikkTabellVisning';
import DataViewer from '../../../komponenter/DataViewer';
import { RessursStatus, RessursSuksess } from '../../../typer/ressurs';

const InnholdWrapper = styled.div`
    max-width: 40rem;
`;

const dummyDataVedtakshistorikkRessurs: RessursSuksess<Vedtaksperiode[]> = {
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

export const Vedtakshistorikk = () => {
    return (
        <InnholdWrapper>
            <VStack gap="4">
                <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
                <DataViewer response={{ dataVedtakshistorikk: dummyDataVedtakshistorikkRessurs }}>
                    {({ dataVedtakshistorikk }) => (
                        <VedtakshistorikkTabellVisning data={dataVedtakshistorikk} />
                    )}
                </DataViewer>
            </VStack>
        </InnholdWrapper>
    );
};
