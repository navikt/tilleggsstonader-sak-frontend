import React, { useState } from 'react';

import { Box, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak, henlagtÅrsakTilTekst } from '../../../typer/behandling/behandlingÅrsak';
import { RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';

const HenleggModal: React.FC = () => {
    const { request, settToast } = useApp();

    const { behandling, hentBehandling, visHenleggModal, settVisHenleggModal } = useBehandling();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [henlagtårsak, settHenlagtårsak] = useState<HenlagtÅrsak>();
    const [henlagtBegrunnelse, settHenlagtBegrunnelse] = useState<string>();

    const lukkModal = () => {
        settFeilmelding(undefined);
        settVisHenleggModal(false);
    };

    const henleggBehandling = () => {
        if (laster) return;

        if (!henlagtårsak) {
            settFeilmelding(lagFeilmelding('Årsak til henleggelse må velges.'));
            return;
        }

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
                    settFeilmelding(feiletRessursTilFeilmelding(respons));
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <ModalWrapper
            visModal={visHenleggModal}
            onClose={lukkModal}
            tittel={'Henlegg behandling'}
            umamiId={'henlegg-behandling'}
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
            <Box paddingInline="space-8">
                <VStack gap={'space-16'}>
                    <RadioGroup
                        legend={''}
                        onChange={(årsak: HenlagtÅrsak) => settHenlagtårsak(årsak)}
                    >
                        <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>
                            {henlagtÅrsakTilTekst[HenlagtÅrsak.TRUKKET_TILBAKE]}
                        </Radio>
                        <Radio value={HenlagtÅrsak.FEILREGISTRERT}>
                            {henlagtÅrsakTilTekst[HenlagtÅrsak.FEILREGISTRERT]}
                        </Radio>
                        <Radio value={HenlagtÅrsak.SKAL_BEHANDLES_I_ARENA}>
                            {henlagtÅrsakTilTekst[HenlagtÅrsak.SKAL_BEHANDLES_I_ARENA]}
                        </Radio>
                        <Radio value={HenlagtÅrsak.SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE}>
                            {henlagtÅrsakTilTekst[HenlagtÅrsak.SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE]}
                        </Radio>
                    </RadioGroup>
                    <Textarea
                        label={'Begrunnelse for henleggelse'}
                        value={henlagtBegrunnelse}
                        onChange={(e) => settHenlagtBegrunnelse(e.target.value)}
                    />
                    <Feilmelding feil={feilmelding} />
                </VStack>
            </Box>
        </ModalWrapper>
    );
};

export default HenleggModal;
