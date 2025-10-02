import React from 'react';

import styled from 'styled-components';

import { Accordion, BodyShort } from '@navikt/ds-react';
import { ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { useHentFullstendigVedtaksOversiktForStønad } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { Behandling } from '../../../typer/behandling/behandling';
import { BehandlingFakta } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../utils/dato';
import { DetaljerteVedtaksperioderBehandling } from '../DetaljerteVedtaksperioderBehandling';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

const GulAccordion = styled(Accordion)`
    background-color: ${ALimegreen50};
    width: 1336px;
    margin-left: 2rem;
    margin-top: 8px;
    border: solid 1px gray;
    border-radius: 12px;
    --__ac-accordion-header-shadow-color: none;
`;

const AccordionHeader = styled(Accordion.Header)`
    padding: 0.5rem;
    border: none;
    box-shadow: none;
    font-size: medium;
`;

const AccordionContent = styled(Accordion.Content)`
    padding: 0 0 1.5rem;
`;

type Props = {
    behandling: Behandling;
    behandlingFakta: BehandlingFakta;
};

export function TidligereVedtaksperioder({ behandling, behandlingFakta }: Props) {
    const { vedtaksperioderOversiktForStønad } =
        useHentFullstendigVedtaksOversiktForStønad(behandling);
    return (
        <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversiktForStønad }}>
            {({ vedtaksperioderOversiktForStønad }) => {
                return (
                    <>
                        {behandlingFakta.arena?.vedtakTom ? (
                            <VarselVedtakIArena arenaVedtakTom={behandlingFakta.arena.vedtakTom} />
                        ) : (
                            <GulAccordion>
                                <Accordion.Item defaultOpen>
                                    <AccordionHeader>
                                        <BodyShort size={'small'} weight={'semibold'}>
                                            {`Saker har vedtak i TS-sak til og med ${formaterDato(vedtaksperioderOversiktForStønad[vedtaksperioderOversiktForStønad.length - 1].tom)}`}
                                        </BodyShort>
                                    </AccordionHeader>
                                    <AccordionContent>
                                        <DetaljerteVedtaksperioderBehandling
                                            stønadstype={behandling.stønadstype}
                                            vedtaksperioderOversiktForStønad={
                                                vedtaksperioderOversiktForStønad
                                            }
                                        />
                                    </AccordionContent>
                                </Accordion.Item>
                            </GulAccordion>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
}
