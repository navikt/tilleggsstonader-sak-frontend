import React, { useState } from 'react';

import { Button, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { Oppfølging, OppfølgingKontrollRequest, OppfølgingUtfall } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../typer/ressurs';

export const OppfølgingModal = ({
    oppfølging,
    lukkModal,
}: {
    oppfølging: Oppfølging;
    lukkModal: () => void;
}) => {
    const { request } = useApp();
    const [kommentar, settKommentar] = useState<string>();
    const [utfall, settUtfall] = useState<OppfølgingUtfall>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const [lagrer, settLagrer] = useState<boolean>(false);

    const lagre = () => {
        if (lagrer) {
            return;
        }
        if (!utfall) {
            settFeilmelding('Mangler utfall');
            return;
        }
        settLagrer(false);

        request<null, OppfølgingKontrollRequest>(`/api/sak/oppfolging/kontroller`, 'POST', {
            id: oppfølging.id,
            version: oppfølging.version,
            utfall: utfall,
            kommentar: kommentar,
        })
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    lukkModal();
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            })
            .finally(() => settLagrer(false));
    };
    return (
        <Modal
            open={true}
            onClose={lukkModal}
            header={{ heading: 'Kontroller behandling' }}
            width={'medium'}
        >
            <Modal.Body>
                <RadioGroup legend="Ufall" onChange={settUtfall}>
                    <Radio value="OK">Ok</Radio>
                    <Radio value="IKKE_OK">Ikke ok</Radio>
                </RadioGroup>
                <Textarea label={'Kommentar'} onChange={(e) => settKommentar(e.target.value)} />
                <Feilmelding>{feilmelding}</Feilmelding>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={lagre} loading={lagrer} size="small">
                    Lagre
                </Button>
                <Button variant="tertiary" onClick={lukkModal} loading={lagrer} size="small">
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
