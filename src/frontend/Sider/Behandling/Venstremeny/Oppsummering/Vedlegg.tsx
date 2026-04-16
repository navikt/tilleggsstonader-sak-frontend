import React from 'react';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import { Lenke } from '../../../../komponenter/Lenke';
import { FaktaDokumentasjon } from '../../../../typer/behandling/behandlingFakta/faktaDokumentasjon';

export function antallVedlegg(fakta?: FaktaDokumentasjon): number {
    return (
        fakta?.dokumentasjon.reduce(
            (sum, dokumentasjon) => sum + dokumentasjon.dokumenter.length,
            0
        ) ?? 0
    );
}

const Vedlegg: React.FC<{ fakta?: FaktaDokumentasjon }> = ({ fakta }) => {
    if (!fakta || antallVedlegg(fakta) === 0) return null;
    return (
        <InfoSeksjon label={`Vedlegg`} ikon={<PaperclipIcon />}>
            <VStack gap="space-8">
                {fakta.dokumentasjon.flatMap((dokumentasjon) =>
                    dokumentasjon.dokumenter.map((dokument) => (
                        <BodyShort size="small" key={dokument.dokumentInfoId}>
                            <Lenke
                                target="_blank"
                                href={`/dokument/journalpost/${fakta.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
                            >
                                {dokumentasjon.type}
                            </Lenke>
                        </BodyShort>
                    ))
                )}
            </VStack>
        </InfoSeksjon>
    );
};
export default Vedlegg;
