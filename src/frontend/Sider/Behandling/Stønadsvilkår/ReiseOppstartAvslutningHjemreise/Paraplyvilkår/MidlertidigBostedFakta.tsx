import React from 'react';

import { ErrorMessage, HStack, TextField } from '@navikt/ds-react';

import { MidlertidigBostedUtkast } from './typer';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { FeilmeldingerMidlertidigBostedPeriode } from '../EndreVilkår/validering';
import { EndreVurderinger } from '../EndreVilkårsVurderinger/EndreVurderinger';
import { Regelstruktur } from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';

interface Props {
    utkast: MidlertidigBostedUtkast;
    endreUtkast: (endring: Partial<MidlertidigBostedUtkast>) => void;
    feil: FeilmeldingerMidlertidigBostedPeriode;
    feilVedLagring: Feil | undefined;
    laster: boolean;
    regelstruktur: Regelstruktur;
    lagre: () => void;
    avbryt: (() => void) | undefined;
}

export const MidlertidigBostedFakta: React.FC<Props> = ({
    utkast,
    endreUtkast,
    feil,
    feilVedLagring,
    laster,
    regelstruktur,
    lagre,
    avbryt,
}) => (
    <>
        <HStack gap="space-16" align="start">
            <FeilmeldingMaksBredde $maxWidth={152}>
                <DateInputMedLeservisning
                    label="Fra"
                    value={utkast.fom}
                    onChange={(fom) => endreUtkast({ fom })}
                    size="small"
                    feil={feil.fom}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={152}>
                <DateInputMedLeservisning
                    label="Til"
                    value={utkast.tom}
                    onChange={(tom) => endreUtkast({ tom })}
                    size="small"
                    feil={feil.tom}
                />
            </FeilmeldingMaksBredde>
            <TextField
                label="Fra adresse"
                size="small"
                value={utkast.fraAdresse}
                onChange={(e) => endreUtkast({ fraAdresse: e.target.value })}
            />
            <TextField
                label="Til adresse"
                size="small"
                value={utkast.tilAdresse}
                onChange={(e) => endreUtkast({ tilAdresse: e.target.value })}
            />
        </HStack>
        <Skillelinje />
        <EndreVurderinger
            regelstruktur={regelstruktur}
            vurderinger={utkast.svar}
            oppdaterVurderinger={(svar) => endreUtkast({ svar })}
            oppdaterGjeldendeFaktaType={() => {}}
            feilmeldinger={{ begrunnelse: feil.begrunnelse }}
        />
        {feil.hovedspørsmål && <ErrorMessage size="small">{feil.hovedspørsmål}</ErrorMessage>}
        <HStack gap="space-16">
            <SmallButton type="button" onClick={lagre} loading={laster}>
                Lagre periode
            </SmallButton>
            {avbryt && (
                <SmallButton type="button" variant="secondary" onClick={avbryt}>
                    Avbryt
                </SmallButton>
            )}
        </HStack>
        <Feilmelding feil={feilVedLagring} />
    </>
);
