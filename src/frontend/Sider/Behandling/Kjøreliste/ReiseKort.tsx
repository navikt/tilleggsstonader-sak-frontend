import React, { FC } from 'react';

import { BodyShort, ExpansionCard, HStack, Label, VStack } from '@navikt/ds-react';

import styles from './ReiseKort.module.css';
import { Reisevurdering } from './Reisevurdering/Reisevurdering';
import { hentRammevedtakForVurdering } from './utils';
import { ReisevurderingPrivatBil, UkeVurdering } from '../../../typer/kjøreliste';
import { formaterIsoPeriode } from '../../../utils/dato';

export const ReiseKort: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterReisevurdering: (oppdatertReisevurdering: ReisevurderingPrivatBil) => void;
}> = ({ reisevurdering, oppdaterReisevurdering }) => {
    const rammeForReise = hentRammevedtakForVurdering(reisevurdering);
    const aktivitetsAdresse = rammeForReise.aktivitetsadresse;

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
        <ExpansionCard aria-label={aktivitetsAdresse} defaultOpen={false}>
            <ExpansionCard.Header>
                <VStack gap="space-8">
                    <ExpansionCard.Title size="medium" className={styles.headerTittel}>
                        {aktivitetsAdresse}
                    </ExpansionCard.Title>
                    <ExpansionCard.Description>
                        <HStack gap="space-16">
                            <VStack gap="space-4">
                                <Label size="medium">Periode</Label>
                                <BodyShort size="medium">
                                    {formaterIsoPeriode(rammeForReise.fom, rammeForReise.tom)}
                                </BodyShort>
                            </VStack>
                            <VStack gap="space-4">
                                <Label size="medium">Reiseavstand én vei</Label>
                                <BodyShort size="medium">{`${rammeForReise.reiseavstandEnVei} km`}</BodyShort>
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
