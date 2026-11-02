import React from 'react';

import { HouseIcon } from '@navikt/aksel-icons';

import { AktivitetReiseTilSamling } from './AktivitetReiseTilSamling';
import { Avreiseadresse } from './Avreiseadresse';
import { Samlinger } from './SamlingsDetaljer/Samlinger';
import { useOppsummeringFilter } from './useOppsummeringFilter';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoSeksjon, SøknadInfoSeksjonFilter, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaReiseTilSamling } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const OppsummeringReiseTilSamling: React.FC<{
    behandlingFakta: BehandlingFaktaReiseTilSamling;
}> = ({ behandlingFakta }) => {
    const { avreiseadresse } = behandlingFakta;
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const {
        filtervalg,
        visFellesopplysninger,
        visSeksjon,
        visVedlegg,
        onFilterChange,
        valgtSeksjon,
    } = useOppsummeringFilter(
        behandlingFakta.samlinger?.length > 0
            ? [
                  {
                      value: 'samlinger',
                      label: 'Samlinger',
                      ariaLabel: 'Vis samlinger fra søknaden',
                      count: behandlingFakta.samlinger?.length,
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <SøknadInfoSeksjonFilter
                ariaLabel="Filtrer søknadsopplysninger for reise til samling"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    <AktivitetReiseTilSamling aktiviteter={behandlingFakta.aktiviteter} />
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                    {avreiseadresse && (
                        <SøknadInfoSeksjon label="Avreiseadresse" ikon={<HouseIcon aria-hidden />}>
                            <Avreiseadresse
                                adresse={avreiseadresse.adresseDetSkalReisesFra}
                                skalReiseFraFolkeregistrertAdresse={
                                    avreiseadresse.skalReiseFraFolkeregistrertAdresse
                                }
                                spørsmål="Reiser du fra din folkeregistrerte adresse?"
                                adresseLabel="Adresse det skal reises fra"
                                folkeregistrertAdresseLabel="Folkeregistrert adresse"
                            />
                        </SøknadInfoSeksjon>
                    )}
                </>
            )}
            {visSeksjon('samlinger') && behandlingFakta.samlinger?.length > 0 && (
                <Samlinger samlinger={behandlingFakta.samlinger} />
            )}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
