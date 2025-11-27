import React from 'react';

import { BodyShort, ExpansionCard, HStack, Label, VStack } from '@navikt/ds-react';

import { KjøresAv } from './KjøresAv';
import { Reiserute } from './Typer/Reisedata';
import { meterTilKm, sekunderTilTimerOgMinutter, linjeTypeTilText } from './utils';
import { formaterDatoMedTidspunkt } from '../../utils/dato';

export const KollektivDetaljer: React.FC<{ rute: Reiserute }> = ({ rute }) => {
    return (
        <ExpansionCard aria-label={'Kollektiv-detaljer'} size={'small'}>
            <ExpansionCard.Header>
                <ExpansionCard.Title as={'h4'} size={'small'}>
                    Kollektiv detaljer
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap={'4'}>
                    <VStack gap={'2'}>
                        <HStack gap={'2'}>
                            <Label>Reiseavstand kollektiv:</Label>
                            <BodyShort>{meterTilKm(rute.avstandMeter)} km</BodyShort>
                        </HStack>
                        <HStack gap={'2'}>
                            <Label>Estimert tid kollektiv:</Label>
                            <BodyShort>
                                {sekunderTilTimerOgMinutter(rute.varighetSekunder)}
                            </BodyShort>
                        </HStack>
                        <HStack gap={'2'}>
                            <Label>Avreisetidspunkt:</Label>
                            <BodyShort>
                                {formaterDatoMedTidspunkt(
                                    new Date(new Date().setHours(8, 0, 0, 0))
                                )}
                            </BodyShort>
                        </HStack>
                    </VStack>

                    <BodyShort weight={'semibold'}>Steg:</BodyShort>
                    {rute.strekninger.map((strekning, strekningIndeks) => {
                        if (!strekning.kollektivDetaljer) {
                            return (
                                <div key={strekningIndeks}>
                                    <BodyShort>
                                        Gå: {sekunderTilTimerOgMinutter(strekning.varighetSekunder)}
                                    </BodyShort>
                                </div>
                            );
                        }

                        return (
                            <div key={strekningIndeks}>
                                <BodyShort weight={'semibold'}>
                                    {`Ta ${linjeTypeTilText[strekning.kollektivDetaljer.linjeType]} ${strekning.kollektivDetaljer.linjeNavn}`}
                                </BodyShort>
                                <BodyShort>
                                    Fra stopp: {strekning.kollektivDetaljer.startHoldeplass}
                                </BodyShort>
                                <BodyShort>
                                    Til stopp: {strekning.kollektivDetaljer.sluttHoldeplass}
                                </BodyShort>
                                <KjøresAv operatører={strekning.kollektivDetaljer.operatør} />
                            </div>
                        );
                    })}
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
