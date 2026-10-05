import React from 'react';

import { HouseIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton } from '@navikt/ds-react';

import { SøknadInfoFelt, SøknadInfoSeksjon } from './Visningskomponenter';
import { FaktaAvreiseadresse } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { reiseAdresseTilTekst } from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export const Avreiseadresse: React.FC<{ avreiseadresse?: FaktaAvreiseadresse }> = ({
    avreiseadresse,
}) => {
    if (!avreiseadresse) {
        return null;
    }

    const adresseTekst = avreiseadresse.adresseDetSkalReisesFra
        ? reiseAdresseTilTekst(avreiseadresse.adresseDetSkalReisesFra)
        : undefined;

    return (
        <SøknadInfoSeksjon label="Avreiseadresse" ikon={<HouseIcon />}>
            {avreiseadresse.skalReiseFraFolkeregistrertAdresse && (
                <SøknadInfoFelt
                    label="Reiser du fra din folkeregistrerte adresse?"
                    value={tekstMedFallback(
                        jaNeiTilTekst,
                        avreiseadresse.skalReiseFraFolkeregistrertAdresse
                    )}
                />
            )}

            {adresseTekst && (
                <SøknadInfoFelt
                    label={
                        avreiseadresse.skalReiseFraFolkeregistrertAdresse === JaNei.JA
                            ? 'Folkeregistrert adresse'
                            : 'Adresse det skal reises fra'
                    }
                    value={
                        <span>
                            <BodyShort as="span" size="small">
                                {adresseTekst}
                            </BodyShort>
                            <CopyButton copyText={adresseTekst} size="small" />
                        </span>
                    }
                />
            )}
        </SøknadInfoSeksjon>
    );
};
