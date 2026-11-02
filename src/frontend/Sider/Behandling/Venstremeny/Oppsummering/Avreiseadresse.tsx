import React from 'react';

import { AdresseFelt } from './AdresseFelt';
import { SøknadInfoFelt } from './Visningskomponenter';
import { FaktaAdresse } from '../../../../typer/behandling/behandlingFakta/faktaAdresse';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export const Avreiseadresse: React.FC<{
    adresse?: FaktaAdresse | null;
    skalReiseFraFolkeregistrertAdresse?: JaNei;
    spørsmål: string;
    adresseLabel: string;
    folkeregistrertAdresseLabel: string;
}> = ({
    adresse,
    skalReiseFraFolkeregistrertAdresse,
    spørsmål,
    adresseLabel,
    folkeregistrertAdresseLabel,
}) => {
    return (
        <>
            {skalReiseFraFolkeregistrertAdresse && (
                <SøknadInfoFelt
                    label={spørsmål}
                    value={tekstMedFallback(jaNeiTilTekst, skalReiseFraFolkeregistrertAdresse)}
                />
            )}
            <AdresseFelt
                {...adresse}
                label={
                    skalReiseFraFolkeregistrertAdresse === JaNei.JA
                        ? folkeregistrertAdresseLabel
                        : adresseLabel
                }
            />
        </>
    );
};
