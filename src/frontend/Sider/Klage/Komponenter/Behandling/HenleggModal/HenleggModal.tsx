import React, { FC, useState } from 'react';
import { useKlagebehandling } from '../../../context/KlagebehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { Klagebehandling } from '../../../typer/klagebehandling/klagebehandling';
import { useKlageApp } from '../../../context/KlageAppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../typer/toast';
import styled from 'styled-components';
import { Alert, Box, Radio, RadioGroup } from '@navikt/ds-react';
import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak } from '../../../../../typer/behandling/behandlingÅrsak';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export const HenleggModal: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const { visHenleggModal, settVisHenleggModal, hentBehandling, hentBehandlingshistorikk } =
        useKlagebehandling();

    const { axiosRequest, settToast } = useKlageApp();
    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<HenlagtÅrsak>();
    const [henleggerBehandling, settHenleggerBehandling] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const henleggBehandling = () => {
        if (henleggerBehandling) {
            return;
        }
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
            return;
        }
        settHenleggerBehandling(true);

        axiosRequest<string, { årsak: HenlagtÅrsak }>({
            method: 'POST',
            url: `/api/klage/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak as HenlagtÅrsak,
            },
        })
            .then((respons: RessursSuksess<string> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    lukkModal();
                    hentBehandling.rerun();
                    hentBehandlingshistorikk.rerun();
                    navigate(`/klagebehandling/${behandling.id}/resultat`);
                    settToast(EToast.BEHANDLING_HENLAGT);
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
                <RadioGroup
                    legend={''}
                    onChange={(årsak: HenlagtÅrsak) => settHenlagtårsak(årsak)}
                >
                    <Radio value={HenlagtÅrsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                    <Radio value={HenlagtÅrsak.FEILREGISTRERT}>Feilregistrert</Radio>
                </RadioGroup>
                {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
            </Box>
        </ModalWrapper>
    );
};
