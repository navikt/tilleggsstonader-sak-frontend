import React, { FC } from 'react';

import { BodyShort, ExpansionCard, HStack, Label, VStack } from '@navikt/ds-react';

import styles from './ReiseKort.module.css';
import { Reisevurdering } from './Reisevurdering/Reisevurdering';
import { ReisevurderingPrivatBil, UkeVurdering } from '../../../typer/kjøreliste';
import { formaterIsoPeriode } from '../../../utils/dato';

export const ReiseKort: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterReisevurdering: (oppdatertReisevurdering: ReisevurderingPrivatBil) => void;
}> = ({ reisevurdering, oppdaterReisevurdering }) => {
    const rammeForReise = reisevurdering.rammevedtak ?? reisevurdering.forrigeRammevedtak;
    const tittel = rammeForReise?.aktivitetsadresse ?? 'Ukjent aktivitetsadresse';
    const periode = formaterIsoPeriode(
        rammeForReise?.fom ?? 'ukjent',
        rammeForReise?.tom ?? 'ukjent'
    );
    const reiseavstand =
        rammeForReise?.reiseavstandEnVei !== undefined
            ? `${rammeForReise.reiseavstandEnVei} km`
            : 'ukjent';

    const oppdaterUke = (oppdatertUke: UkeVurdering) => {
        const oppdaterteUker = reisevurdering.uker.map((uke) =>
            uke.fraDato === oppdatertUke.fraDato ? oppdatertUke : uke
        );
        oppdaterReisevurdering({
            ...reisevurdering,
            uker: oppdaterteUker,
        });
    };

    return (
        <ExpansionCard aria-label={tittel} defaultOpen={false}>
            <ExpansionCard.Header>
                <VStack gap="space-8">
                    <ExpansionCard.Title size="medium" className={styles.headerTittel}>
                        {tittel}
                    </ExpansionCard.Title>
                    <ExpansionCard.Description>
                        <HStack gap="space-16">
                            <VStack gap="space-4">
                                <Label size="medium">Periode</Label>
                                <BodyShort size="medium">{periode}</BodyShort>
                            </VStack>
                            <VStack gap="space-4">
                                <Label size="medium">Reiseavstand en vei</Label>
                                <BodyShort size="medium">{reiseavstand}</BodyShort>
                            </VStack>
                        </HStack>
                    </ExpansionCard.Description>
                </VStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content className={styles.innhold}>
                <Reisevurdering reisevurdering={reisevurdering} oppdaterUke={oppdaterUke} />
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
