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
}

export const KopierVilkårReiseTilSamlingModal: React.FC<Props> = ({
    visModal,
    onClose,
    onBekreft,
    eksisterendeFom,
    eksisterendeTom,
    eksisterendeAdresse,
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
                },
                lukkKnapp: {
                    onClick: onClose,
                    tekst: 'Avbryt',
                },
            }}
        >
            <VStack gap="space-4">
                <BodyShort>
                    Eksisterende periode: {formaterNullableIsoDato(eksisterendeFom)} -{' '}
                    {formaterNullableIsoDato(eksisterendeTom)}
                </BodyShort>
                <BodyShort>Eksisterende adresse: {eksisterendeAdresse}</BodyShort>
            </VStack>
        </ModalWrapper>
    );
};
