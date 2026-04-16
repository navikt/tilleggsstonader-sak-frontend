import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import Utdanning, { harUtdanningsopplysninger } from './Utdanning';
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
import { BehandlingFaktaLæremidler } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

const læremidlerSeksjoner = [oppsummeringAltFilterVerdi, 'utdanning', 'vedlegg'] as const;
type LæremidlerSeksjon = (typeof læremidlerSeksjoner)[number];

function erLæremidlerSeksjon(value: string): value is LæremidlerSeksjon {
    return erGyldigOppsummeringsvalg(value, læremidlerSeksjoner);
}

const OppsummeringLæremidler: React.FC<{
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
            {visFellesopplysninger && behandlingFakta.søknadMottattTidspunkt && (
                <InfoSeksjon label="Søknadsdato" ikon={<CalendarIcon />}>
                    <BodyShort size="small">
                        {formaterDato(behandlingFakta.søknadMottattTidspunkt)}
                    </BodyShort>
                </InfoSeksjon>
            )}
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

export default OppsummeringLæremidler;
