import React, { useState } from 'react';

import { Alert, Box, Radio, RadioGroup } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak } from '../../../typer/behandling/behandlingÅrsak';
import { RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';

interface Props {
    visModal: boolean;
    settVisModal: (vis: boolean) => void;
    behandlingId: string | undefined;
    settBehandlingId: (behandlingId: string | undefined) => void;
    hentBehandlinger: () => void;
}

const HenleggModal: React.FC<Props> = ({
    visModal,
    settVisModal,
    behandlingId,
    settBehandlingId,
    hentBehandlinger,
}) => {
    const { request, settToast } = useApp();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [henlagtårsak, settHenlagtårsak] = useState<HenlagtÅrsak>();

    const lukkModal = () => {
        settFeilmelding('');
        settBehandlingId(undefined);
        settVisModal(false);
    };

    const henleggBehandling = () => {
        if (!behandlingId || !henlagtårsak || laster) return;

        settLaster(true);

        request<string, { årsak: string }>(`/api/sak/behandling/${behandlingId}/henlegg`, 'POST', {
            årsak: henlagtårsak,
        })
            .then((respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    hentBehandlinger();
                    lukkModal();
                    settToast(Toast.BEHANDLING_HENLAGT);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <ModalWrapper
            visModal={visModal}
            onClose={() => {}}
            tittel={'Henlegg behandling'}
            ariaLabel={'Velg årsak til henleggelse av behandlingen'}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: henleggBehandling,
                    tekst: 'Henlegg',
                    disabled: laster,
                    spinner: laster,
                },
                lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
            }}
        >
            <Box paddingInline="2">
                <RadioGroup legend={''} onChange={(årsak: HenlagtÅrsak) => settHenlagtårsak(årsak)}>
                    <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                    <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
                </RadioGroup>
                {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            </Box>
        </ModalWrapper>
    );
};

export default HenleggModal;
