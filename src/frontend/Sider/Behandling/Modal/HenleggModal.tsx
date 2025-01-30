import React, { useState } from 'react';

import { Alert, Box, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak } from '../../../typer/behandling/behandlingÅrsak';
import { RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';

const HenleggModal: React.FC = () => {
    const { request, settToast } = useApp();

    const { behandling, hentBehandling, visHenleggModal, settVisHenleggModal } = useBehandling();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [henlagtårsak, settHenlagtårsak] = useState<HenlagtÅrsak>();
    const [henlagtBegrunnelse, settHenlagtBegrunnelse] = useState<string>();

    const lukkModal = () => {
        settFeilmelding('');
        settVisHenleggModal(false);
    };

    const henleggBehandling = () => {
        if (!henlagtårsak || laster) return;

        settLaster(true);

        request<null, { årsak: string; begrunnelse?: string }>(
            `/api/sak/behandling/${behandling.id}/henlegg`,
            'POST',
            {
                årsak: henlagtårsak,
                begrunnelse: henlagtBegrunnelse,
            }
        )
            .then((respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
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
            visModal={visHenleggModal}
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
                <VStack gap={'4'}>
                    <RadioGroup
                        legend={''}
                        onChange={(årsak: HenlagtÅrsak) => settHenlagtårsak(årsak)}
                    >
                        <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                        <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
                        <Radio value={HenlagtÅrsak.SKAL_BEHANDLES_I_ARENA}>
                            Skal behandles i Arena
                        </Radio>
                        <Radio value={HenlagtÅrsak.SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE}>
                            Skal behandles av annet fagområde
                        </Radio>
                    </RadioGroup>
                    <Textarea
                        label={'Begrunnelse for henleggelse'}
                        value={henlagtBegrunnelse}
                        onChange={(e) => settHenlagtBegrunnelse(e.target.value)}
                    />
                    {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
                </VStack>
            </Box>
        </ModalWrapper>
    );
};

export default HenleggModal;
