import * as React from 'react';

import styled from 'styled-components';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, BodyShort, Detail, Heading, Label } from '@navikt/ds-react';

import { TotrinnskontrollUnderkjentResponse, årsakUnderkjentTilTekst } from './typer';
import { formaterIsoDatoTid } from '../../../utils/dato';

const ÅrsakerUnderkjentWrapper = styled.div`
    margin-top: 0.5rem;
`;

const SukksessIkonMedHøyreMargin = styled(CheckmarkIcon)`
    margin-right: 0.5rem;
`;

const ÅrsakUnderkjentRad = styled(BodyShort)`
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
`;

const BreakWordBodyLong = styled(BodyLong)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const TotrinnskontrollUnderkjent: React.FC<{
    totrinnskontroll: TotrinnskontrollUnderkjentResponse;
}> = ({ totrinnskontroll }) => {
    return (
        <>
            <Heading size={'small'} level={'3'}>
                Totrinnskontroll
            </Heading>
            <Alert variant={'warning'} inline={true}>
                Vedtaket er underkjent
            </Alert>
            <div>
                <BodyShort size={'small'}>{totrinnskontroll.opprettetAv}</BodyShort>
                <BodyShort size={'small'}>
                    {formaterIsoDatoTid(totrinnskontroll.opprettetTid)}
                </BodyShort>
            </div>
            {totrinnskontroll.årsakerUnderkjent.length > 0 && (
                <div>
                    <Label>Årsak til underkjennelse</Label>
                    <Detail>Manglende eller feil opplysninger om:</Detail>
                    <ÅrsakerUnderkjentWrapper>
                        {totrinnskontroll.årsakerUnderkjent.map((årsakUnderkjent) => (
                            <ÅrsakUnderkjentRad key={årsakUnderkjent}>
                                <SukksessIkonMedHøyreMargin />
                                {årsakUnderkjentTilTekst[årsakUnderkjent]}
                            </ÅrsakUnderkjentRad>
                        ))}
                    </ÅrsakerUnderkjentWrapper>
                </div>
            )}
            <div>
                <Label>Begrunnelse</Label>
                <BreakWordBodyLong size={'small'}>{totrinnskontroll.begrunnelse}</BreakWordBodyLong>
            </div>
        </>
    );
};

export default TotrinnskontrollUnderkjent;
