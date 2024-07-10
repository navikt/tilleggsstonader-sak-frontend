import React, { useState } from 'react';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';

interface Props {
    fagsakId: string;
    hentKlagebehandlinger: () => void;
    lukkModal: () => void;
}

interface OpprettKlageRequest {
    mottattDato: string;
}

const OpprettKlageBehandling: React.FC<Props> = ({
    fagsakId,
    hentKlagebehandlinger,
    lukkModal,
}) => {
    const { request } = useApp();
    const [klageMottattDato, settKlageMottattDato] = useState('');
    const [feilmelding, settFeilmelding] = useState<string>();

    const opprett = () => {
        request<string, OpprettKlageRequest>(`/api/sak/klage/fagsak/${fagsakId}`, 'POST', {
            mottattDato: klageMottattDato,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentKlagebehandlinger();
                lukkModal();
            } else {
                settFeilmelding(response.frontendFeilmelding || response.melding);
            }
        });
    };

    return (
        <VStack gap="4">
            <DateInput
                label={'Klage mottatt'}
                onChange={(dato: string | undefined) => settKlageMottattDato(dato || '')}
                value={klageMottattDato}
            />
            <HStack gap="4" justify={'end'}>
                <Button variant="tertiary" onClick={lukkModal} size="small">
                    Avbryt
                </Button>
                <Button variant="primary" onClick={opprett} size="small">
                    Lagre
                </Button>
            </HStack>
            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default OpprettKlageBehandling;
