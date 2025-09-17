import React from 'react';

import styled from 'styled-components';

import { Accordion, BodyShort } from '@navikt/ds-react';
import { ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { Behandling } from '../../../typer/behandling/behandling';
import { DetaljerteVedtaksperioderBehandling } from '../DetaljerteVedtaksperioderBehandling';

const GulAccordion = styled(Accordion)`
    background-color: ${ALimegreen50};
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
};

export function VedtaksperioderAccordion({ behandling }: Props) {
    return (
        <GulAccordion>
            <Accordion.Item defaultOpen>
                <AccordionHeader>
                    <BodyShort size={'small'} weight={'semibold'}>
                        Vedtaksperioder
                    </BodyShort>
                </AccordionHeader>
                <AccordionContent>
                    <DetaljerteVedtaksperioderBehandling behandling={behandling} />
                </AccordionContent>
            </Accordion.Item>
        </GulAccordion>
    );
}
