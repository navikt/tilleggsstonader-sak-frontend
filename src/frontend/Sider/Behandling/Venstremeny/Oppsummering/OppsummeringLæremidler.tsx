import React from 'react';

import Utdanning, { harUtdanningsopplysninger } from './Utdanning';
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
import { BehandlingFaktaLæremidler } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

const læremidlerSeksjoner = [oppsummeringAltFilterVerdi, 'utdanning', 'vedlegg'] as const;
type LæremidlerSeksjon = (typeof læremidlerSeksjoner)[number];

function erLæremidlerSeksjon(value: string): value is LæremidlerSeksjon {
    return erGyldigOppsummeringsvalg(value, læremidlerSeksjoner);
}

export const OppsummeringLæremidler: React.FC<{
    behandlingFakta: BehandlingFaktaLæremidler;
}> = ({ behandlingFakta }) => {
    const [valgtSeksjon, settValgtSeksjon] = React.useState<LæremidlerSeksjon>(
        oppsummeringAltFilterVerdi
    );
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const visUtdanningsseksjon = harUtdanningsopplysninger(behandlingFakta.utdanning);
    const filtervalg: OppsummeringSeksjonsfilterValg[] = [
        oppsummeringAltFilterValg,
        ...(visUtdanningsseksjon
            ? [
                  {
                      value: 'utdanning',
                      label: 'Utdanning',
                      ariaLabel: 'Vis utdanningsopplysninger',
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
    const visUtdanning = visFellesopplysninger || valgtSeksjon === 'utdanning';
    const visVedlegg = visFellesopplysninger || valgtSeksjon === 'vedlegg';

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for læremidler"
                onChange={(value) => {
                    if (erLæremidlerSeksjon(value)) {
                        settValgtSeksjon(value);
                    }
                }}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <YtelseSituasjon
                    faktaHovedytelse={behandlingFakta.hovedytelse}
                    arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
                />
            )}
            {visUtdanning && visUtdanningsseksjon && (
                <Utdanning faktaUtdanning={behandlingFakta.utdanning} />
            )}
            {visVedlegg && antallDokumenter > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};
