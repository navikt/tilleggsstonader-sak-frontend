import * as React from 'react';
import styled from 'styled-components';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';
import { VedtakValg, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
import { alleHjemlerTilVisningstekst } from './hjemmel';
import { Vurderingsfelter } from './vurderingsfelter';
import { OmgjøringDto, OpprettholdelseDto, VurderingDto } from '../../hooks/useVurdering';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem 4rem;
`;

const Avsnitt = styled.div`
    margin: 0 0 2rem 0;
`;

const FritekstfeltLesemodus = styled(BodyLong)`
    white-space: pre-wrap;
`;

export const VurderingLesemodus: React.FC<{ vurdering?: VurderingDto }> = ({ vurdering }) => {
    switch (vurdering?.vedtak) {
        case VedtakValg.OMGJØR_VEDTAK:
            return <OmgjørVedtak vurdering={vurdering} />;
        case VedtakValg.OPPRETTHOLD_VEDTAK:
            return <OpprettholdVedtak vurdering={vurdering} />;
        default:
            return <></>;
    }
};

const OmgjørVedtak: React.FC<{ vurdering: OmgjøringDto }> = ({ vurdering }) => {
    const { vedtak, årsak, begrunnelseOmgjøring } = vurdering;
    return (
        <Container>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Vedtak
                </Heading>
                <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
            </Avsnitt>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Årsak
                </Heading>
                <BodyShort>{årsakValgTilTekst[årsak]}</BodyShort>
            </Avsnitt>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Begrunnelse for omgjøring (internt notat)
                </Heading>
                <FritekstfeltLesemodus>{begrunnelseOmgjøring}</FritekstfeltLesemodus>
            </Avsnitt>
        </Container>
    );
};

const OpprettholdVedtak: React.FC<{ vurdering: OpprettholdelseDto }> = ({ vurdering }) => {
    const { vedtak, hjemmel, innstillingKlageinstans, interntNotat } = vurdering;
    return (
        <Container>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Vedtak
                </Heading>
                <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
            </Avsnitt>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Årsak
                </Heading>
                <BodyShort>{alleHjemlerTilVisningstekst[hjemmel]}</BodyShort>
            </Avsnitt>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Innstilling til NAV Klageinstans
                </Heading>
                <FritekstfeltLesemodus>{innstillingKlageinstans}</FritekstfeltLesemodus>
            </Avsnitt>
            <Avsnitt>
                <Heading level="1" size="medium">
                    Internt notat
                </Heading>
                <FritekstfeltLesemodus>{interntNotat}</FritekstfeltLesemodus>
            </Avsnitt>
        </Container>
    );
};
