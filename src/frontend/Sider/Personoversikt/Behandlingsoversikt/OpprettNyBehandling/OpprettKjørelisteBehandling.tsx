import React, { useState } from 'react';

import { Button, HelpText, HStack, Label, Select, VStack } from '@navikt/ds-react';

import { OpprettNyBehandlingType } from './OpprettNyBehandlingUtils';
import { useApp } from '../../../../context/AppContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../../komponenter/Feil/feilmeldingUtils';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { BehandlingÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
import { RessursStatus } from '../../../../typer/ressurs';
import { harVerdi } from '../../../../utils/utils';

interface Props {
    fagsakId: string;
    lukkModal: () => void;
    hentBehandlinger: () => void;
}

interface OpprettBehandlingRequest {
    fagsakId: string;
    årsak: BehandlingÅrsak;
    kravMottatt?: string;
    forenkletBehandlingstype: OpprettNyBehandlingType;
}

const OpprettKjørelisteBehandling: React.FC<Props> = ({
    fagsakId,
    lukkModal,
    hentBehandlinger,
}) => {
    const { request } = useApp();

    const [årsak, settÅrsak] = useState<BehandlingÅrsak>();

    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const [kravMottatt, settKravMottatt] = useState<string | undefined>(undefined);

    const opprett = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        if (!årsak) {
            settFeilmelding(lagFeilmelding('Mangler årsak'));
            settLaster(false);
            return;
        }
        if (!kravMottatt) {
            settFeilmelding(lagFeilmelding('Krav mottatt må settes'));
            settLaster(false);
            return;
        }

        request<string, OpprettBehandlingRequest>(`/api/sak/behandling`, 'POST', {
            fagsakId: fagsakId,
            årsak: årsak,
            kravMottatt: kravMottatt,
            forenkletBehandlingstype: OpprettNyBehandlingType.KJØRELISTE,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentBehandlinger();
                lukkModal();
            } else {
                settFeilmelding(feiletRessursTilFeilmelding(response));
                settLaster(false);
            }
        });
    };

    const endreÅrsak = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (harVerdi(value)) {
            settÅrsak(value as BehandlingÅrsak);
        } else {
            settÅrsak(undefined);
        }
    };

    return (
        <VStack gap="space-16">
            <Select label={'Årsak'} onChange={endreÅrsak}>
                <option value="">- Velg årsak -</option>
                <option value={BehandlingÅrsak.REGISTRER_KJØRELISTE_FOR_BRUKER}>
                    Registrer kjøreliste for bruker
                </option>
            </Select>
            <DateInput
                label={
                    <HStack gap={'space-8'}>
                        <Label>Krav mottatt</Label>
                        <HelpText title={'Krav mottatt'}>
                            Krav mottatt kan være når man fikk beskjed om endring eller søknadsdato
                            i tilfelle årsak er søknad
                        </HelpText>
                    </HStack>
                }
                onChange={(dato: string | undefined) => settKravMottatt(dato)}
                value={kravMottatt}
                toDate={new Date()}
            />
            <Feilmelding feil={feilmelding} />
            <HStack gap="space-16" justify={'end'}>
                <Button variant="tertiary" onClick={lukkModal} size="small">
                    Avbryt
                </Button>
                <Button variant="primary" onClick={opprett} size="small">
                    Lagre
                </Button>
            </HStack>
        </VStack>
    );
};

export default OpprettKjørelisteBehandling;
