import React from 'react';

import { Link } from '@navikt/ds-react';

import { Informasjonskilde, Informasjonsrad, InfoSeksjon } from './Visningskomponenter';
import { FaktaDokumentasjon } from '../../../../typer/behandling/behandlingFakta/faktaDokumentasjon';
import { lenkeDokument } from '../../../../utils/dokumentLenke';

const Vedlegg: React.FC<{ fakta?: FaktaDokumentasjon }> = ({ fakta }) => {
    if (!fakta) return null;
    return (
        <InfoSeksjon label={`Vedlegg`}>
            {fakta.dokumentasjon.flatMap((dokumentasjon) =>
                dokumentasjon.dokumenter.map((dokument) => (
                    <Informasjonsrad
                        key={dokument.dokumentInfoId}
                        kilde={Informasjonskilde.SØKNAD}
                        verdi={
                            <Link
                                target="_blank"
                                href={lenkeDokument(
                                    fakta.journalpostId,
                                    dokument.dokumentInfoId,
                                    dokumentasjon.type
                                )}
                            >
                                {dokumentasjon.type}
                            </Link>
                        }
                    />
                ))
            )}
        </InfoSeksjon>
    );
};
export default Vedlegg;
