import React from 'react';

import { VStack } from '@navikt/ds-react';

import { Aktivitet } from './Aktivitet';
import { BarnDetaljer } from './BarnDetaljer';
import { useOppsummeringFilter } from './UseOppsummeringFilter';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoSeksjonFilter, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaTilsynBarn } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const OppsummeringTilsynBarn: React.FC<{
    behandlingFakta: BehandlingFaktaTilsynBarn;
}> = ({ behandlingFakta }) => {
    const barnDetSøkesFor = behandlingFakta.barn.filter((barn) => barn.søknadgrunnlag != null);
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const {
        filtervalg,
        visFellesopplysninger,
        visSeksjon,
        visVedlegg,
        onFilterChange,
        valgtSeksjon,
    } = useOppsummeringFilter(
        barnDetSøkesFor.length > 0
            ? [
                  {
                      value: 'barn',
                      label: 'Barn',
                      ariaLabel: 'Vis opplysninger om barn',
                      count: barnDetSøkesFor.length,
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <SøknadInfoSeksjonFilter
                ariaLabel="Filtrer søknadsopplysninger for tilsyn barn"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    <Aktivitet aktivitet={behandlingFakta.aktivitet} />
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                </>
            )}
            {visSeksjon('barn') && barnDetSøkesFor.length > 0 && (
                <VStack gap="space-12">
                    {barnDetSøkesFor.map((barn) => (
                        <BarnDetaljer barn={barn} key={barn.barnId} />
                    ))}
                </VStack>
            )}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
