import React, { useState } from 'react';

import { BodyLong, VStack } from '@navikt/ds-react';

import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';
import { RessursStatus } from '../../../../../typer/ressurs';

export const SlettKjørelisteModal: React.FC<{
    kjørelisteId: string;
    visModal: boolean;
    lukkModal: () => void;
}> = ({ kjørelisteId, visModal, lukkModal }) => {
    const { slettKjøreliste } = useRegistrerKjøreliste();

    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const lukkOgNullstillModal = () => {
        settFeilmelding(undefined);
        lukkModal();
    };

    const slett = async () => {
        if (laster) return;
        settLaster(true);

        const respons = await slettKjøreliste(kjørelisteId);
        if (respons.status === RessursStatus.SUKSESS) {
            lukkOgNullstillModal();
        } else {
            settFeilmelding(feiletRessursTilFeilmelding(respons));
        }

        settLaster(false);
    };

    return (
        <ModalWrapper
            visModal={visModal}
            onClose={lukkOgNullstillModal}
            tittel="Er du sikker?"
            umamiId={'slett-kjøreliste'}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: slett,
                    tekst: 'Ja, slett',
                    spinner: laster,
                },
                lukkKnapp: {
                    onClick: lukkOgNullstillModal,
                    tekst: 'Avbryt',
                    disabled: laster,
                },
            }}
        >
            <VStack gap="space-16">
                <BodyLong>
                    Du er i ferd med å slette den manuelt registrerte kjørelisten, ønsker du å
                    slette arbeidet?
                </BodyLong>
                <Feilmelding feil={feilmelding} />
            </VStack>
        </ModalWrapper>
    );
};
