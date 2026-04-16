import React from 'react';

import AktivitetDagligReise from './AktivitetDagligReise';
import { ReiseDetaljer } from './ReiseDetlajer/ReiseDetaljer';
import Vedlegg, { antallVedlegg } from './Vedlegg';
import {
    erGyldigOppsummeringsvalg,
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
    OppsummeringSeksjonsfilter,
    OppsummeringSeksjonsfilterValg,
    Søknadsdato,
} from './Visningskomponenter';
import YtelseSituasjon from './YtelseSituasjon';
import { BehandlingFaktaDagligReise } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

const dagligReiseSeksjoner = [oppsummeringAltFilterVerdi, 'reiser', 'vedlegg'] as const;
type DagligReiseSeksjon = (typeof dagligReiseSeksjoner)[number];

function erDagligReiseSeksjon(value: string): value is DagligReiseSeksjon {
    return erGyldigOppsummeringsvalg(value, dagligReiseSeksjoner);
}

export const OppsummeringDagligReise: React.FC<{
    behandlingFakta: BehandlingFaktaDagligReise;
}> = ({ behandlingFakta }) => {
    const [valgtSeksjon, settValgtSeksjon] = React.useState<DagligReiseSeksjon>(
        oppsummeringAltFilterVerdi
    );
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const filtervalg: OppsummeringSeksjonsfilterValg[] = [
        oppsummeringAltFilterValg,
        ...(behandlingFakta.reiser.length > 0
            ? [
                  {
                      value: 'reiser',
                      label: 'Reiser',
                      ariaLabel: 'Vis reiseopplysninger',
                      count: behandlingFakta.reiser.length,
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
    const visReiser = visFellesopplysninger || valgtSeksjon === 'reiser';
    const visVedlegg = visFellesopplysninger || valgtSeksjon === 'vedlegg';

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for daglig reise"
                onChange={(value) => {
                    if (erDagligReiseSeksjon(value)) {
                        settValgtSeksjon(value);
                    }
                }}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                    {behandlingFakta.aktiviteter && (
                        <AktivitetDagligReise aktiviteter={behandlingFakta.aktiviteter} />
                    )}
                </>
            )}
            {visReiser && behandlingFakta.reiser.length > 0 && (
                <ReiseDetaljer reiser={behandlingFakta.reiser}></ReiseDetaljer>
            )}
            {visVedlegg && antallDokumenter > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};
