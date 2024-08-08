import React from 'react';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import { Lenke } from '../../../../komponenter/Lenke';
import { FaktaDokumentasjon } from '../../../../typer/behandling/behandlingFakta/faktaDokumentasjon';

const Vedlegg: React.FC<{ fakta?: FaktaDokumentasjon }> = ({ fakta }) => {
    if (!fakta) return null;
    return (
        <InfoSeksjon label={`Vedlegg`} ikon={<PaperclipIcon />}>
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
        </InfoSeksjon>
    );
};
export default Vedlegg;
