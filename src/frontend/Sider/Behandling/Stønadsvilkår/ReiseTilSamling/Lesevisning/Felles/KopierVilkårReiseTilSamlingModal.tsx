import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { ModalWrapper } from '../../../../../../komponenter/Modal/ModalWrapper';
import { formaterNullableIsoDato } from '../../../../../../utils/dato';

interface Props {
    visModal: boolean;
    onClose: () => void;
    onBekreft: () => void;
    eksisterendeFom: string;
    eksisterendeTom: string;
    eksisterendeAdresse: string;
    laster?: boolean;
}

export const KopierVilkårReiseTilSamlingModal: React.FC<Props> = ({
    visModal,
    onClose,
    onBekreft,
    eksisterendeFom,
    eksisterendeTom,
    eksisterendeAdresse,
    laster = false,
}) => {
    return (
        <ModalWrapper
            visModal={visModal}
            tittel="Kopier vilkår"
            umamiId="kopier-vilkar-reise-til-samling"
            onClose={onClose}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: onBekreft,
                    tekst: 'Kopier',
                    spinner: laster,
                    disabled: laster,
                },
                lukkKnapp: {
                    onClick: onClose,
                    tekst: 'Avbryt',
                    disabled: laster,
                },
            }}
        >
            <VStack gap="space-16">
                <BodyShort>
                    Eksisterende periode: {formaterNullableIsoDato(eksisterendeFom)} -{' '}
                    {formaterNullableIsoDato(eksisterendeTom)}
                </BodyShort>
                <BodyShort>Eksisterende adresse: {eksisterendeAdresse}</BodyShort>
            </VStack>
        </ModalWrapper>
    );
};
