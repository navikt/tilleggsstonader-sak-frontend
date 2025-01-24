import React, { useState } from 'react';

import { Alert, Box, Radio, RadioGroup } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak } from '../../../typer/behandling/behandlingÅrsak';
import { RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';

interface Props {
    behandlingId: string;
    settBehandlingId: (behandlingId: string | undefined) => void;
    hentBehandlinger: () => void;
}

const HenleggModal: React.FC<Props> = ({ behandlingId, settBehandlingId, hentBehandlinger }) => {
    const { request, settToast } = useApp();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [henlagtårsak, settHenlagtårsak] = useState<HenlagtÅrsak>();

    const lukkModal = () => {
        settFeilmelding('');
        settBehandlingId(undefined);
    };

    const henleggBehandling = () => {
        if (!henlagtårsak || laster) return;

        settLaster(true);

        request<null, { årsak: string }>(`/api/sak/behandling/${behandlingId}/henlegg`, 'POST', {
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
            visModal={true}
            onClose={lukkModal}
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
                <Alert variant={'info'}>
                    Det er nå mulig å henlegge en behandling inne på en behandling. Til høyre om
                    Sett på vent-knappen.
                </Alert>
                <RadioGroup legend={''} onChange={(årsak: HenlagtÅrsak) => settHenlagtårsak(årsak)}>
                    <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                    <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
                    <Radio value={HenlagtÅrsak.SKAL_BEHANDLES_I_ARENA}>
                        Skal behandles i Arena
                    </Radio>
                    <Radio value={HenlagtÅrsak.SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE}>
                        Skal behandles av annet fagområde
                    </Radio>
                </RadioGroup>
                {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            </Box>
        </ModalWrapper>
    );
};

export default HenleggModal;
