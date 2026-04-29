import React from 'react';

import { useOppsummeringFilter } from './UseOppsummeringFilter';
import Utdanning, { harUtdanningsopplysninger } from './Utdanning';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { OppsummeringSeksjonsfilter, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaLæremidler } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const OppsummeringLæremidler: React.FC<{
    behandlingFakta: BehandlingFaktaLæremidler;
}> = ({ behandlingFakta }) => {
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const visUtdanningsseksjon = harUtdanningsopplysninger(behandlingFakta.utdanning);
    const {
        filtervalg,
        visFellesopplysninger,
        visSeksjon,
        visVedlegg,
        onFilterChange,
        valgtSeksjon,
    } = useOppsummeringFilter(
        visUtdanningsseksjon
            ? [
                  {
                      value: 'utdanning',
                      label: 'Utdanning',
                      ariaLabel: 'Vis utdanningsopplysninger',
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for læremidler"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visSeksjon('utdanning') && visUtdanningsseksjon && (
                <Utdanning faktaUtdanning={behandlingFakta.utdanning} />
            )}
            {visFellesopplysninger && (
                <YtelseSituasjon
                    faktaHovedytelse={behandlingFakta.hovedytelse}
                    arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
                />
            )}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
