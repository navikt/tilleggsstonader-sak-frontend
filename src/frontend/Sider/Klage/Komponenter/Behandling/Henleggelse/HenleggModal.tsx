import React, { FC, useState } from 'react';
import { useKlagebehandling } from '../../../App/context/KlagebehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { Klagebehandling } from '../../../App/typer/klagebehandling/klagebehandling';
import { useApp } from '../../../App/context/KlageAppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from './EHenlagtÅrsak';
import styled from 'styled-components';
import { Alert, Radio, RadioGroup } from '@navikt/ds-react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export const HenleggModal: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const {
        visHenleggModal,
        settVisHenleggModal,
        hentBehandling,
        hentBehandlingshistorikk
    } = useKlagebehandling();

    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
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

        axiosRequest<string, { årsak: EHenlagtårsak }>({
            method: 'POST',
            url: `/api/klage/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak as EHenlagtårsak,
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
            <RadioGroup legend={''} onChange={(årsak: EHenlagtårsak) => settHenlagtårsak(årsak)}>
                <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
            </RadioGroup>
            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
        </ModalWrapper>
    );
};
