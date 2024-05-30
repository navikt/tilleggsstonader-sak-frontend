import React, { useState } from 'react';

import { Button, Select, VStack } from '@navikt/ds-react';

import OpprettKlageBehandling from './OpprettKlageBehandling';
import { useApp } from '../../../../context/AppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import {
    BehandlingType,
    behandlingTypeTilTekst,
} from '../../../../typer/behandling/behandlingType';
import { RessursStatus } from '../../../../typer/ressurs';

interface OpprettKlageRequest {
    mottattDato: string;
    klageGjelderTilbakekreving: boolean;
}

const OpprettNyBehandlingModal = () => {
    const { request } = useApp();

    const [visModal, settVisModal] = useState(false);
    const [behandlingtype, settBehandlingtype] = useState<BehandlingType>();
    const [klageGjelderTilbakekreving, settKlageGjelderTilbakekreving] = useState<boolean>(false);
    const [kravMottattDato, settKravMottattDato] = useState('');
    const [feilmelding, settFeilmelding] = useState<string>();

    const opprettKlage = (data: OpprettKlageRequest) => {
        request<null, OpprettKlageRequest>(`/tilleggsstonader-klage`, 'POST', data).then(
            (response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    lukkModal();
                } else {
                    settFeilmelding(response.frontendFeilmelding || response.melding);
                }
            }
        );
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
        settKlageGjelderTilbakekreving(false);
        settKravMottattDato('');
        settBehandlingtype(undefined);
    };

    return (
        <div className="py-16">
            <Button variant={'secondary'} onClick={() => settVisModal(true)}>
                Opprett ny behandling
            </Button>
            <ModalWrapper
                visModal={visModal}
                onClose={lukkModal}
                tittel="Opprett ny behandling"
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () =>
                            opprettKlage({
                                mottattDato: kravMottattDato,
                                klageGjelderTilbakekreving: klageGjelderTilbakekreving,
                            }),
                        tekst: 'Opprett',
                        disabled: true,
                    },
                    lukkKnapp: {
                        onClick: () => lukkModal(),
                        tekst: 'Avbryt',
                    },
                    marginTop: 4,
                }}
            >
                <VStack gap="4">
                    <Select
                        value={behandlingtype}
                        label="Behandlingstype"
                        onChange={(event) => {
                            settBehandlingtype(event.target.value as BehandlingType);
                        }}
                    >
                        <option value={''}>Velg</option>
                        <option value="KLAGE">
                            {behandlingTypeTilTekst[BehandlingType.KLAGE]}
                        </option>
                    </Select>
                    {behandlingtype === BehandlingType.KLAGE && (
                        <OpprettKlageBehandling
                            klageGjelderTilbakekreving={klageGjelderTilbakekreving}
                            settKlageGjelderTilbakekreving={settKlageGjelderTilbakekreving}
                            kravMottattDato={kravMottattDato}
                            settKravMottattDato={settKravMottattDato}
                            feilmelding={feilmelding}
                        />
                    )}
                </VStack>
            </ModalWrapper>
        </div>
    );
};

export default OpprettNyBehandlingModal;
