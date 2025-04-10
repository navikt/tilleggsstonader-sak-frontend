import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Heading, HStack, Textarea, UNSAFE_Combobox, VStack } from '@navikt/ds-react';

import { finnNyFrist } from './antallDagerFrist';
import {
    SettPåVent,
    SettPåVentError,
    SettPåVentRequest,
    StatusSettPåVent,
    tekstTilÅrsak,
    årsakerForContext,
    ÅrsakSettPåVent,
    årsakTilTekst,
} from './typer';
import { harValgtAnnet, validerSettPåVent } from './validerSettPåVent';
import { useApp } from '../../context/AppContext';
import { useSettPåVent } from '../../context/SettPåVentContext';
import { FormErrors, isValid } from '../../hooks/felles/useFormState';
import { useTriggRerendringAvDateInput } from '../../hooks/useTriggRerendringAvDateInput';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../Feil/feilmeldingUtils';
import DateInput from '../Skjema/DateInput';

const ÅrsakContainer = styled.div`
    width: 35rem;
`;

const SettPåVentForm: React.FC<{
    status: StatusSettPåVent | undefined;
    settStatusPåVent: (status: Ressurs<StatusSettPåVent>) => void;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, settStatusPåVent, settStatusPåVentRedigering }) => {
    const { request } = useApp();

    const { context, behandlingId, hentBehandling, hentBehandlingshistorikk } = useSettPåVent();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [settPåVent, settSettPåVent] = useState<SettPåVent>({
        årsaker: status?.årsaker || [],
        frist: status?.frist,
        kommentar: status?.kommentar,
        oppgaveVersjon: status?.oppgaveVersjon,
    });

    const { keyDato, oppdaterDatoKey } = useTriggRerendringAvDateInput();

    const [formErrors, settFormErrors] = useState<FormErrors<SettPåVentError>>();

    const oppdatererEksisterendeSettPåVent = !!status;

    const oppdaterÅrsaker = (option: string, isSelected: boolean) => {
        const årsak = tekstTilÅrsak[option];
        settSettPåVent((prevState) => {
            const årsaker = isSelected
                ? [...prevState.årsaker, årsak]
                : prevState.årsaker.filter((o) => o !== årsak);
            return { ...prevState, årsaker: årsaker, frist: finnNyFrist(årsaker) };
        });
        oppdaterDatoKey();
    };

    const settPåVentClick = (beholdOppgave: boolean) => {
        if (laster) return;

        const validering = validerSettPåVent(settPåVent);
        settFormErrors(validering);
        if (!isValid(validering)) {
            return;
        }

        settLaster(true);
        request<StatusSettPåVent, SettPåVentRequest>(
            `/api/${context}/sett-pa-vent/${behandlingId}`,
            oppdatererEksisterendeSettPåVent ? 'PUT' : 'POST',
            { ...settPåVent, beholdOppgave }
        ).then((response) => {
            settLaster(false);
            if (response.status === RessursStatus.SUKSESS) {
                settStatusPåVentRedigering(false);
                settFeilmelding(undefined);
                settStatusPåVent(response);
                if (oppdatererEksisterendeSettPåVent) {
                    hentBehandlingshistorikk.rerun();
                }
                hentBehandling.rerun();
            } else {
                settFeilmelding(feiletRessursTilFeilmelding(response));
            }
        });
    };

    const filteredOptions = årsakerForContext[context]
        .filter((årsak) => settPåVent.årsaker.indexOf(årsak as ÅrsakSettPåVent) === -1)
        .map((årsak) => årsakTilTekst[årsak as ÅrsakSettPåVent]);

    const kommentarLabel = harValgtAnnet(settPåVent.årsaker)
        ? 'Kommentar (påkrevd)'
        : 'Kommentar (valgfri)';

    return (
        <VStack gap={'4'}>
            <Heading size={'medium'}>Sett behandling på vent</Heading>
            <HStack gap={'4'}>
                <ÅrsakContainer>
                    <UNSAFE_Combobox
                        label="Hva venter vi på? (Du kan velge flere)"
                        filteredOptions={filteredOptions}
                        isMultiSelect
                        onToggleSelected={oppdaterÅrsaker}
                        selectedOptions={settPåVent.årsaker.map((årsak) => årsakTilTekst[årsak])}
                        options={Object.keys(tekstTilÅrsak)}
                        error={formErrors?.årsaker}
                    />
                </ÅrsakContainer>
                <DateInput
                    key={keyDato}
                    label={'Frist for svar'}
                    onChange={(dato) =>
                        settSettPåVent((prevState) => ({ ...prevState, frist: dato || '' }))
                    }
                    value={settPåVent.frist}
                    feil={formErrors?.frist}
                />
            </HStack>
            <Textarea
                label={kommentarLabel}
                description={'Forklar gjerne hva som er gjort.'}
                value={settPåVent.kommentar || ''}
                onChange={(e) =>
                    settSettPåVent((prevState) => ({
                        ...prevState,
                        kommentar: e.target.value || '',
                    }))
                }
                maxLength={1000}
                error={formErrors?.kommentar}
            />
            <HStack gap={'4'}>
                <Button size={'small'} onClick={() => settPåVentClick(false)}>
                    {oppdatererEksisterendeSettPåVent
                        ? 'Oppdater og sett som ufordelt'
                        : 'Sett på vent'}
                </Button>
                <Button size={'small'} variant={'secondary'} onClick={() => settPåVentClick(true)}>
                    {oppdatererEksisterendeSettPåVent
                        ? 'Oppdater og behold oppgave'
                        : 'Sett på vent og behold oppgave'}
                </Button>
                <Button
                    size={'small'}
                    variant={'tertiary'}
                    onClick={() => settStatusPåVentRedigering(false)}
                >
                    Angre
                </Button>
            </HStack>
            <Feilmelding feil={feilmelding} />
        </VStack>
    );
};

export default SettPåVentForm;
