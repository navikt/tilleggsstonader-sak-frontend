import React, { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Alert, Box, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import styles from './HenleggModal.module.css';
import { useApp } from '../../../../context/AppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { HenlagtÅrsak, henlagtÅrsakTilTekst } from '../../../../typer/behandling/behandlingÅrsak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { Toast } from '../../../../typer/toast';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { useHenleggBehandling } from '../../hooks/useHenleggBehandling';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

export const HenleggModal: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const { settToast } = useApp();

    const { visHenleggModal, settVisHenleggModal, hentBehandling } = useKlagebehandling();

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
            umamiId={'henlegg'}
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
                    </RadioGroup>
                    <Textarea
                        label={'Begrunnelse for henleggelse'}
                        value={henlagtBegrunnelse}
                        onChange={(e) => settHenlagtBegrunnelse(e.target.value)}
                    />
                    {feilmelding && (
                        <Alert variant={'error'} className={styles.alertStripe}>
                            {feilmelding}
                        </Alert>
                    )}
                </VStack>
            </Box>
        </ModalWrapper>
    );
};
