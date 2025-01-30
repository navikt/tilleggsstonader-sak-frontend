import React, { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Alert, Box, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { Toast } from '../../../../typer/toast';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { useHenleggBehandling } from '../../hooks/useHenleggBehandling';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export const HenleggModal: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const { settToast } = useApp();

    const { visHenleggModal, settVisHenleggModal, hentBehandling, hentBehandlingshistorikk } =
        useKlagebehandling();

    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<HenlagtÅrsak>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [henleggerBehandling, settHenleggerBehandling] = useState<boolean>(false);
    const [henlagtBegrunnelse, settHenlagtBegrunnelse] = useState<string>();

    const { lagreHenleggelse } = useHenleggBehandling(behandling.id);

    const henleggBehandling = () => {
        if (henleggerBehandling) {
            return;
        }
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
            return;
        }
        settHenleggerBehandling(true);

        lagreHenleggelse(henlagtårsak, henlagtBegrunnelse)
            .then((respons: RessursSuksess<string> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    lukkModal();
                    hentBehandling.rerun();
                    hentBehandlingshistorikk.rerun();
                    navigate(`/klagebehandling/${behandling.id}/resultat`);
                    settToast(Toast.BEHANDLING_HENLAGT);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settHenleggerBehandling(false));
    };

    const lukkModal = () => {
        settFeilmelding('');
        settVisHenleggModal(false);
    };

    return (
        <ModalWrapper
            tittel={'Henlegg'}
            visModal={visHenleggModal}
            onClose={() => lukkModal()}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => henleggBehandling(),
                    tekst: 'Henlegg',
                    disabled: henleggerBehandling,
                },
                lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
            }}
            ariaLabel={'Velg årsak til henleggelse av behandlingen'}
        >
            <Box paddingInline="2">
                <VStack gap={'4'}>
                    <RadioGroup
                        legend={''}
                        onChange={(årsak: HenlagtÅrsak) => settHenlagtårsak(årsak)}
                    >
                        <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                        <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
                    </RadioGroup>
                    {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                    <Textarea
                        label={'Begrunnelse for henleggelse'}
                        value={henlagtBegrunnelse}
                        onChange={(e) => settHenlagtBegrunnelse(e.target.value)}
                    />
                </VStack>
            </Box>
        </ModalWrapper>
    );
};
