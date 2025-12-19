import React from 'react';

import {
    Alert,
    BodyShort,
    CopyButton,
    ExpansionCard,
    HStack,
    Label,
    VStack,
} from '@navikt/ds-react';

import { KjøresAv } from './KjøresAv';
import { Reisedata } from './Typer/Reisedata';
import { linjeTypeTilText, meterTilKm, sekunderTilTimerOgMinutter } from './utils';
import { formaterDatoMedTidspunkt } from '../../utils/dato';

export const KollektivDetaljer: React.FC<{ reisedata: Reisedata }> = ({ reisedata }) => {
    if (!reisedata.reiserute) {
        return <Alert variant={'info'}>Fant ikke kollektivrute for reisen.</Alert>;
    }
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
                            <BodyShort>{meterTilKm(reisedata.reiserute.avstandMeter)} km</BodyShort>
                        </HStack>
                        <HStack gap={'2'}>
                            <Label>Estimert tid kollektiv:</Label>
                            <BodyShort>
                                {sekunderTilTimerOgMinutter(reisedata.reiserute.varighetSekunder)}
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
                    {reisedata.reiserute.strekninger.map((strekning, strekningIndeks) => {
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
                                    {`Ta ${linjeTypeTilText[strekning.kollektivDetaljer.linjeType]} ${strekning.kollektivDetaljer.linjeNavn ?? ''}`}
                                </BodyShort>
                                <HStack gap={'1'}>
                                    <BodyShort>
                                        Fra stopp: {strekning.kollektivDetaljer.startHoldeplass}
                                    </BodyShort>
                                    <CopyButton
                                        size={'xsmall'}
                                        copyText={strekning.kollektivDetaljer.startHoldeplass}
                                    />
                                </HStack>
                                <HStack gap={'1'}>
                                    <BodyShort>
                                        Til stopp: {strekning.kollektivDetaljer.sluttHoldeplass}
                                    </BodyShort>
                                    <CopyButton
                                        size={'xsmall'}
                                        copyText={strekning.kollektivDetaljer.sluttHoldeplass}
                                    />
                                </HStack>
                                <KjøresAv operatører={strekning.kollektivDetaljer.operatør} />
                            </div>
                        );
                    })}
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
