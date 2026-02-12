import React, { useMemo, useState } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import { ModalWrapper } from '../../../../../komponenter/Modal/ModalWrapper';
import DateInput from '../../../../../komponenter/Skjema/DateInput';
import { formaterNullableIsoDato } from '../../../../../utils/dato';

interface Props {
    visModal: boolean;
    onClose: () => void;
    onBekreft: (kopidato: string) => void;
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
    const [kopidato, settKopidato] = useState<string | undefined>(undefined);
    const [valideringsfeil, settValideringsfeil] = useState<string | undefined>(undefined);

    const konsekvenstekst = useMemo(() => {
        if (!kopidato) {
            return null;
        }

        if (kopidato > eksisterendeFom && kopidato <= eksisterendeTom) {
            return `Det eksisterende vilkåret vil få sluttdato ${formaterNullableIsoDato(
                new Date(new Date(kopidato).getTime() - 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
            )}. Det nye vilkåret vil starte på valgt dato.`;
        }

        return 'Det eksisterende vilkåret vil ikke endres. Det nye vilkåret vil starte på valgt dato.';
    }, [kopidato, eksisterendeFom, eksisterendeTom]);

    const validerOgBekreft = () => {
        if (!kopidato) {
            settValideringsfeil('Du må angi en startdato');
            return;
        }

        settValideringsfeil(undefined);
        onBekreft(kopidato);
    };

    const handleClose = () => {
        settKopidato(undefined);
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
                    value={kopidato}
                    onChange={(dato) => {
                        settKopidato(dato);
                        settValideringsfeil(undefined);
                    }}
                    feil={valideringsfeil}
                    size="small"
                />
                {konsekvenstekst && <BodyShort size="small">{konsekvenstekst}</BodyShort>}
                <Feilmelding feil={feilmelding} />
            </VStack>
        </ModalWrapper>
    );
};
