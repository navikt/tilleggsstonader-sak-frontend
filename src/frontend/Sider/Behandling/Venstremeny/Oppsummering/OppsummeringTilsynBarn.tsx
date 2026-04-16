import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import BarnDetaljer from './BarnDetaljer';
import Vedlegg, { antallVedlegg } from './Vedlegg';
import {
    erGyldigOppsummeringsvalg,
    InfoSeksjon,
    OppsummeringSeksjonsfilter,
    OppsummeringSeksjonsfilterValg,
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
} from './Visningskomponenter';
import YtelseSituasjon from './YtelseSituasjon';
import { BehandlingFaktaTilsynBarn } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

const tilsynBarnSeksjoner = [oppsummeringAltFilterVerdi, 'barn', 'vedlegg'] as const;
type TilsynBarnSeksjon = (typeof tilsynBarnSeksjoner)[number];

function erTilsynBarnSeksjon(value: string): value is TilsynBarnSeksjon {
    return erGyldigOppsummeringsvalg(value, tilsynBarnSeksjoner);
}

const OppsummeringTilsynBarn: React.FC<{
    behandlingFakta: BehandlingFaktaTilsynBarn;
}> = ({ behandlingFakta }) => {
    const barnDetSøkesFor = behandlingFakta.barn.filter((barn) => barn.søknadgrunnlag != null);
    const [valgtSeksjon, settValgtSeksjon] = React.useState<TilsynBarnSeksjon>(
        oppsummeringAltFilterVerdi
    );
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const filtervalg: OppsummeringSeksjonsfilterValg[] = [
        oppsummeringAltFilterValg,
        ...(barnDetSøkesFor.length > 0
            ? [
                  {
                      value: 'barn',
                      label: 'Barn',
                      ariaLabel: 'Vis opplysninger om barn',
                      count: barnDetSøkesFor.length,
                  },
              ]
            : []),
        ...(antallDokumenter > 0
            ? [
                  {
                      value: 'vedlegg',
                      label: 'Vedlegg',
                      ariaLabel: 'Vis vedlegg',
                      count: antallDokumenter,
                  },
              ]
            : []),
    ];
    const visFellesopplysninger = valgtSeksjon === oppsummeringAltFilterVerdi;
    const visBarn = visFellesopplysninger || valgtSeksjon === 'barn';
    const visVedlegg = visFellesopplysninger || valgtSeksjon === 'vedlegg';

    return (
        <>
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for tilsyn barn"
                onChange={(value) => {
                    if (erTilsynBarnSeksjon(value)) {
                        settValgtSeksjon(value);
                    }
                }}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    {behandlingFakta.søknadMottattTidspunkt && (
                        <InfoSeksjon label="Søknadsdato" ikon={<CalendarIcon />}>
                            <BodyShort size="small">
                                {formaterDato(behandlingFakta.søknadMottattTidspunkt)}
                            </BodyShort>
                        </InfoSeksjon>
                    )}
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                    {behandlingFakta.aktivitet && (
                        <Aktivitet aktivitet={behandlingFakta.aktivitet}></Aktivitet>
                    )}
                </>
            )}
            {visBarn && barnDetSøkesFor.length > 0 && (
                <VStack gap="space-12">
                    {barnDetSøkesFor.map((barn, index) => (
                        <BarnDetaljer barn={barn} defaultOpen={index === 0} key={barn.barnId} />
                    ))}
                </VStack>
            )}
            {visVedlegg && antallDokumenter > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};

export default OppsummeringTilsynBarn;
