import React, { useState } from 'react';

import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { Button, Heading, HStack, Textarea, UNSAFE_Combobox, VStack } from '@navikt/ds-react';

import { finnNyFrist } from './antallDagerFrist';
import {
    alleÅrsaker,
    SettPåVent,
    SettPåVentError,
    StatusSettPåVent,
    tekstTilÅrsak,
    ÅrsakSettPåVent,
    årsakTilTekst,
} from './typer';
import { harValgtAnnet, validerSettPåVent } from './validerSettPåVent';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { FormErrors, isValid } from '../../../hooks/felles/useFormState';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../komponenter/Skjema/DateInput';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';

const ÅrsakContainer = styled.div`
    width: 35rem;
`;

const SettPåVentForm: React.FC<{
    status: StatusSettPåVent | undefined;
    settStatusPåVent: (status: Ressurs<StatusSettPåVent>) => void;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, settStatusPåVent, settStatusPåVentRedigering }) => {
    const { behandling, hentBehandling } = useBehandling();
    const { request } = useApp();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [settPåVent, settSettPåVent] = useState<SettPåVent>({
        årsaker: status?.årsaker || [],
        frist: status?.frist,
        kommentar: undefined,
        oppgaveVersjon: status?.oppgaveVersjon,
    });

    // Brukes for å nullstille DateInput då DatePicker ellers må nullstilled fra useDatepicker
    const [datoKey, settDatoKey] = useState<string>(uuid());

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
        settDatoKey(uuid());
    };

    const settPåVentClick = () => {
        if (laster) return;

        const validering = validerSettPåVent(settPåVent);
        settFormErrors(validering);
        if (!isValid(validering)) {
            return;
        }

        settLaster(true);
        request<StatusSettPåVent, SettPåVent>(
            `/api/sak/sett-pa-vent/${behandling.id}`,
            oppdatererEksisterendeSettPåVent ? 'PUT' : 'POST',
            settPåVent
        ).then((response) => {
            settLaster(false);
            if (response.status === RessursStatus.SUKSESS) {
                settStatusPåVentRedigering(false);
                settFeilmelding(undefined);
                settStatusPåVent(response);
                hentBehandling.rerun();
            } else {
                settFeilmelding(response.frontendFeilmelding);
            }
        });
    };

    const filteredOptions = alleÅrsaker
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
                    key={datoKey}
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
                <Button size={'small'} onClick={settPåVentClick}>
                    {oppdatererEksisterendeSettPåVent ? 'Oppdater' : 'Sett på vent'}
                </Button>
                <Button
                    size={'small'}
                    variant={'secondary'}
                    onClick={() => settStatusPåVentRedigering(false)}
                >
                    Angre
                </Button>
            </HStack>
            <Feilmelding>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default SettPåVentForm;
