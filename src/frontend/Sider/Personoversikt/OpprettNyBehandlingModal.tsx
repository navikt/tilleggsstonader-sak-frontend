import React, { useRef, useState } from 'react';

import { styled } from 'styled-components';

import { Button, Modal, Select } from '@navikt/ds-react';

import KlageGjelderTilbakekreving from './KlageGjelderTilbakekreving';
import { useApp } from '../../context/AppContext';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import DateInput from '../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../typer/ressurs';

export const StyledSelect = styled(Select)`
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 33.5rem;
`;

const DatoContainer = styled.div`
    margin-top: 2rem;
    margin-bottom: 18rem;
`;

const OpprettNyBehandlingModal = () => {
    const { request } = useApp();
    const ref = useRef<HTMLDialogElement>(null);

    const [nyBehandlingValg, settNyBehandlingValg] = useState('');
    const [klageGjelderTilbakekreving, settKlageGjelderTilbakekreving] = useState<boolean>(false);
    const [kravMottattDato, settKravMottattDato] = useState('');
    const [feilmelding, settFeilmelding] = useState<string>();

    interface OpprettKlageRequest {
        mottattDato: string;
        klageGjelderTilbakekreving: boolean;
    }

    const opprettKlage = (data: OpprettKlageRequest) => {
        request<null, OpprettKlageRequest>(`/tilleggsstonader-klage`, 'POST', data).then(
            (response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    ref.current?.close();
                } else {
                    settFeilmelding(response.frontendFeilmelding || response.melding);
                }
            }
        );
    };

    return (
        <div className="py-16">
            <Button variant={'secondary'} onClick={() => ref.current?.showModal()}>
                Opprett ny behandling
            </Button>
            <Modal ref={ref} header={{ heading: 'Opprett ny behandling' }}>
                <Modal.Body>
                    <StyledSelect
                        label="Behandlingstype"
                        value={nyBehandlingValg || ''}
                        onChange={(value) => settNyBehandlingValg(value.target.value)}
                    >
                        <option value="">Velg</option>
                        <option value="klage">Klage</option>
                    </StyledSelect>
                    {nyBehandlingValg && (
                        <div>
                            <KlageGjelderTilbakekreving
                                klageGjelderTilbakekreving={klageGjelderTilbakekreving}
                                settKlageGjelderTilbakekreving={settKlageGjelderTilbakekreving}
                            />
                            <DatoContainer>
                                <DateInput
                                    label={'Krav mottat'}
                                    onChange={(dato: string | undefined) =>
                                        settKravMottattDato(dato || '')
                                    }
                                    value={kravMottattDato}
                                />
                                <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
                            </DatoContainer>
                        </div>
                    )}
                </Modal.Body>
                {nyBehandlingValg && (
                    <div>
                        <Modal.Footer>
                            <Button
                                type="button"
                                onClick={() =>
                                    opprettKlage({
                                        mottattDato: kravMottattDato,
                                        klageGjelderTilbakekreving: klageGjelderTilbakekreving,
                                    })
                                }
                            >
                                Opprett
                            </Button>
                            <Button
                                type="button"
                                variant="tertiary"
                                onClick={() => ref.current?.close()}
                            >
                                Avbryt
                            </Button>
                        </Modal.Footer>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OpprettNyBehandlingModal;
