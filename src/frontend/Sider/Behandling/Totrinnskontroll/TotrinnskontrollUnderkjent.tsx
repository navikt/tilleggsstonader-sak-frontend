import * as React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import {
    Alert,
    BodyLong,
    BodyShort,
    Detail,
    HStack,
    Heading,
    Label,
    VStack,
} from '@navikt/ds-react';

import { TotrinnskontrollUnderkjentResponse, årsakUnderkjentTilTekst } from './typer';
import { formaterIsoDatoTid } from '../../../utils/dato';

const TotrinnskontrollUnderkjent: React.FC<{
    totrinnskontroll: TotrinnskontrollUnderkjentResponse;
}> = ({ totrinnskontroll }) => {
    return (
        <VStack gap="space-16">
            <VStack gap="space-8">
                <Heading size={'small'} level={'3'}>
                    Totrinnskontroll
                </Heading>
                <Alert variant={'warning'} inline={true} size="small">
                    Vedtaket er underkjent
                </Alert>
                <BodyShort size={'small'}>
                    {formaterIsoDatoTid(totrinnskontroll.opprettetTid)} av{' '}
                    {totrinnskontroll.opprettetAv}
                </BodyShort>
            </VStack>
            {totrinnskontroll.årsakerUnderkjent.length > 0 && (
                <div>
                    <Label>Årsak til underkjennelse</Label>
                    <Detail>Manglende eller feil opplysninger om:</Detail>
                    {totrinnskontroll.årsakerUnderkjent.map((årsakUnderkjent) => (
                        <HStack key={årsakUnderkjent} gap="space-8" wrap={false} align="center">
                            <CheckmarkIcon />
                            <BodyShort size="small">
                                {årsakUnderkjentTilTekst[årsakUnderkjent]}
                            </BodyShort>
                        </HStack>
                    ))}
                </div>
            )}
            <div>
                <Label>Begrunnelse</Label>
                <BodyLong size={'small'}>{totrinnskontroll.begrunnelse}</BodyLong>
            </div>
        </VStack>
    );
};

export default TotrinnskontrollUnderkjent;
