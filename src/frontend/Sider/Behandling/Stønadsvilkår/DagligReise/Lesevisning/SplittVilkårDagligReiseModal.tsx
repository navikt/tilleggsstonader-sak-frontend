import React, { useState } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';
import DateInput from '../../../../../komponenter/Skjema/DateInput';
import { formaterNullableIsoDato, plusDager, tilDato } from '../../../../../utils/dato';

interface Props {
    visModal: boolean;
    onClose: () => void;
    onBekreft: (splittdato: string) => void;
    eksisterendeFom: string;
    eksisterendeTom: string;
    laster?: boolean;
    feilmelding?: Feil;
}

export const SplittVilkårDagligReiseModal: React.FC<Props> = ({
    visModal,
    onClose,
    onBekreft,
    eksisterendeFom,
    eksisterendeTom,
    laster = false,
    feilmelding,
}) => {
    const [splittdato, settSplittdato] = useState<string | undefined>(undefined);
    const [valideringsfeil, settValideringsfeil] = useState<string | undefined>(undefined);

    const validerOgBekreft = () => {
        if (!splittdato) {
            settValideringsfeil('Du må angi en splittdato');
            return;
        }

        if (splittdato <= eksisterendeFom) {
            settValideringsfeil('Splittdato må være etter fom-datoen på vilkåret som splittes');
            return;
        }

        if (splittdato >= eksisterendeTom) {
            settValideringsfeil('Splittdato må være før tom-datoen på vilkåret som splittes');
            return;
        }

        settValideringsfeil(undefined);
        onBekreft(splittdato);
    };

    const handleClose = () => {
        settSplittdato(undefined);
        settValideringsfeil(undefined);
        onClose();
    };

    return (
        <ModalWrapper
            visModal={visModal}
            tittel="Splitt vilkår"
            umamiId="splitt-vilkar-daglig-reise"
            onClose={handleClose}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: validerOgBekreft,
                    tekst: 'Splitt',
                    spinner: laster,
                    disabled: laster,
                },
                lukkKnapp: {
                    onClick: handleClose,
                    tekst: 'Avbryt',
                    disabled: laster,
                },
            }}
        >
            <VStack gap="4">
                <BodyShort>
                    Eksisterende periode: {formaterNullableIsoDato(eksisterendeFom)} -{' '}
                    {formaterNullableIsoDato(eksisterendeTom)}
                </BodyShort>
                <DateInput
                    label="Splittdato"
                    value={splittdato}
                    onChange={(dato) => {
                        settSplittdato(dato);
                        settValideringsfeil(undefined);
                    }}
                    feil={valideringsfeil}
                    size="small"
                    fromDate={tilDato(plusDager(eksisterendeFom, 1))}
                    toDate={tilDato(plusDager(eksisterendeTom, -1))}
                />
                <BodyShort size="small">
                    Det eksisterende vilkåret vil få sluttdato dagen før splittdatoen. Det nye
                    vilkåret vil starte på splittdatoen.
                </BodyShort>
                <Feilmelding feil={feilmelding} />
            </VStack>
        </ModalWrapper>
    );
};
