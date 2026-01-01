import * as React from 'react';

import { BodyLong, BodyShort, Heading, List } from '@navikt/ds-react';

import { alleHjemlerTilVisningstekst } from './hjemmel';
import styles from './VurderingLesemodus.module.css';
import { VedtakValg, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
import { OmgjøringDto, OpprettholdelseDto, VurderingDto } from '../../hooks/useVurdering';

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
        <div className={styles.container}>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Vedtak
                </Heading>
                <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
            </div>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Årsak
                </Heading>
                <BodyShort>{årsakValgTilTekst[årsak]}</BodyShort>
            </div>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Begrunnelse for omgjøring (internt notat)
                </Heading>
                <BodyLong className={styles.fritekstfeltLesemodus}>{begrunnelseOmgjøring}</BodyLong>
            </div>
        </div>
    );
};

const OpprettholdVedtak: React.FC<{ vurdering: OpprettholdelseDto }> = ({ vurdering }) => {
    const { vedtak, hjemler, innstillingKlageinstans, interntNotat } = vurdering;
    return (
        <div className={styles.container}>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Vedtak
                </Heading>
                <BodyShort>{vedtakValgTilTekst[vedtak]}</BodyShort>
            </div>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Hjemler
                </Heading>
                <List>
                    {hjemler.map((hjemmel) => (
                        <List.Item key={hjemmel}>{alleHjemlerTilVisningstekst[hjemmel]}</List.Item>
                    ))}
                </List>
            </div>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Innstilling til Nav Klageinstans
                </Heading>
                <BodyLong className={styles.fritekstfeltLesemodus}>
                    {innstillingKlageinstans}
                </BodyLong>
            </div>
            <div className={styles.avsnitt}>
                <Heading level="1" size="medium">
                    Internt notat
                </Heading>
                <BodyLong className={styles.fritekstfeltLesemodus}>{interntNotat}</BodyLong>
            </div>
        </div>
    );
};
