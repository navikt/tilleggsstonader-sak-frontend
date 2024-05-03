import React, { ReactNode } from 'react';

import { DatabaseIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';

export enum Informasjonskilde {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
}

const mapIkon = (ikon: Informasjonskilde) => {
    switch (ikon) {
        case Informasjonskilde.REGISTER:
            return <DatabaseIcon />;
        case Informasjonskilde.SØKNAD:
            return <FileTextIcon />;
    }
};

export const Informasjonsrad: React.FC<{
    kilde: Informasjonskilde;
    verdi?: string | ReactNode;
}> = ({ kilde, verdi = 'Ingen data registrert' }) => {
    return (
        <HStack gap="2" wrap={false}>
            {mapIkon(kilde)}
            <BodyShort size="small">{verdi}</BodyShort>
        </HStack>
    );
};

export const InfoSeksjon: React.FC<{ label: string; children?: React.ReactNode }> = ({
    label,
    children,
}) => {
    return (
        <VStack gap="4">
            <Heading level={'4'} size={'xsmall'}>
                {label}
            </Heading>
            {children}
        </VStack>
    );
};
