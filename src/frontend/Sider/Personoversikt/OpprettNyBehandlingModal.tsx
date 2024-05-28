import React, { useState } from 'react';

import { styled } from 'styled-components';

import { Button, Select, VStack } from '@navikt/ds-react';

import KlageGjelderTilbakekreving from './KlageGjelderTilbakekreving';
import { useApp } from '../../context/AppContext';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { ModalWrapper } from '../../komponenter/Modal/ModalWrapper';
import DateInput from '../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../typer/ressurs';

export const DatoWrapper = styled.div`
    margin-top: 1rem;
`;

interface OpprettKlageRequest {
    mottattDato: string;
    klageGjelderTilbakekreving: boolean;
}

const OpprettNyBehandlingModal = () => {
    const { request } = useApp();

    const [visModal, settVisModal] = useState(false);
    const [nyBehandlingValg, settNyBehandlingValg] = useState('');
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
        settNyBehandlingValg('');
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
                        label="Behandlingstype"
                        value={nyBehandlingValg || ''}
                        onChange={(value) => settNyBehandlingValg(value.target.value)}
                    >
                        <option value="">Velg</option>
                        <option value="klage">Klage</option>
                    </Select>
                    {nyBehandlingValg && (
                        <>
                            <KlageGjelderTilbakekreving
                                klageGjelderTilbakekreving={klageGjelderTilbakekreving}
                                settKlageGjelderTilbakekreving={settKlageGjelderTilbakekreving}
                            />
                            <DatoWrapper>
                                <DateInput
                                    label={'Krav mottat'}
                                    onChange={(dato: string | undefined) =>
                                        settKravMottattDato(dato || '')
                                    }
                                    value={kravMottattDato}
                                />
                            </DatoWrapper>
                            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
                        </>
                    )}
                </VStack>
            </ModalWrapper>
        </div>
    );
};

export default OpprettNyBehandlingModal;
