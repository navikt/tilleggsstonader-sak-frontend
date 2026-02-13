import React, { useMemo, useState } from 'react';

import { Alert, BodyShort, VStack } from '@navikt/ds-react';

import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';
import DateInput from '../../../../../komponenter/Skjema/DateInput';
import { dagenFør, formaterNullableIsoDato } from '../../../../../utils/dato';

interface Props {
    visModal: boolean;
    onClose: () => void;
    onBekreft: (kopidato: string) => void;
    eksisterendeFom: string;
    eksisterendeTom: string;
    laster?: boolean;
    feilmelding?: Feil;
}

export const KopierVilkårDagligReiseModal: React.FC<Props> = ({
    visModal,
    onClose,
    onBekreft,
    eksisterendeFom,
    eksisterendeTom,
    laster = false,
    feilmelding,
}) => {
    const [valgtStartdato, settValgtStartdato] = useState<string | undefined>(undefined);
    const [valideringsfeil, settValideringsfeil] = useState<string | undefined>(undefined);

    const endrerEksisterende =
        valgtStartdato && valgtStartdato > eksisterendeFom && valgtStartdato <= eksisterendeTom;

    const konsekvenstekst = useMemo(() => {
        if (!valgtStartdato) {
            return null;
        }

        if (endrerEksisterende) {
            return `Det eksisterende vilkåret vil få sluttdato ${formaterNullableIsoDato(dagenFør(valgtStartdato))}.`;
        }

        return 'Det eksisterende vilkåret vil ikke endres.';
    }, [valgtStartdato, endrerEksisterende]);

    const validerOgBekreft = () => {
        if (!valgtStartdato) {
            settValideringsfeil('Du må angi en startdato');
            return;
        }

        settValideringsfeil(undefined);
        onBekreft(valgtStartdato);
    };

    const handleClose = () => {
        settValgtStartdato(undefined);
        settValideringsfeil(undefined);
        onClose();
    };

    return (
        <ModalWrapper
            visModal={visModal}
            tittel="Kopier vilkår"
            umamiId="kopier-vilkar-daglig-reise"
            onClose={handleClose}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: validerOgBekreft,
                    tekst: 'Kopier',
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
                    label="Startdato for nytt vilkår"
                    value={valgtStartdato}
                    onChange={(dato) => {
                        settValgtStartdato(dato);
                        settValideringsfeil(undefined);
                    }}
                    feil={valideringsfeil}
                    size="small"
                />
                {konsekvenstekst &&
                    (endrerEksisterende ? (
                        <Alert variant="warning" size="small" inline>
                            {konsekvenstekst}
                        </Alert>
                    ) : (
                        <BodyShort size="small">{konsekvenstekst}</BodyShort>
                    ))}
                <Feilmelding feil={feilmelding} />
            </VStack>
        </ModalWrapper>
    );
};
