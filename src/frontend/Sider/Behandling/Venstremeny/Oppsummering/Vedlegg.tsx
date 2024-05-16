import React from 'react';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, Link } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import { FaktaDokumentasjon } from '../../../../typer/behandling/behandlingFakta/faktaDokumentasjon';

const Vedlegg: React.FC<{ fakta?: FaktaDokumentasjon }> = ({ fakta }) => {
    if (!fakta) return null;
    return (
        <InfoSeksjon label={`Vedlegg`} ikon={<PaperclipIcon />}>
            {fakta.dokumentasjon.flatMap((dokumentasjon) =>
                dokumentasjon.dokumenter.map((dokument) => (
                    <BodyShort size="small" key={dokument.dokumentInfoId}>
                        <Link
                            target="_blank"
                            href={`/dokument/journalpost/${fakta.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
                        >
                            {dokumentasjon.type}
                        </Link>
                    </BodyShort>
                ))
            )}
        </InfoSeksjon>
    );
};
export default Vedlegg;
