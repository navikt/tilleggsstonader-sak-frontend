import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import AktivitetDagligReise from './AktivitetDagligReise';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import { ReiseDetaljer } from './ReiseDetlajer/ReiseDetaljer';
import Vedlegg, { antallVedlegg } from './Vedlegg';
import {
    erGyldigOppsummeringsvalg,
    InfoSeksjon,
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
    OppsummeringSeksjonsfilter,
    OppsummeringSeksjonsfilterValg,
    OppsummeringSeksjonsgruppe,
} from './Visningskomponenter';
import { BehandlingFaktaDagligReise } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

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
                    <OppsummeringSeksjonsgruppe>
                        {behandlingFakta.søknadMottattTidspunkt && (
                            <InfoSeksjon
                                label="Søknadsdato"
                                ikon={<CalendarIcon />}
                                layout="grouped"
                            >
                                <BodyShort size="small">
                                    {formaterDato(behandlingFakta.søknadMottattTidspunkt)}
                                </BodyShort>
                            </InfoSeksjon>
                        )}
                    </OppsummeringSeksjonsgruppe>
                    <OppsummeringSeksjonsgruppe>
                        <Hovedytelse
                            faktaHovedytelse={behandlingFakta.hovedytelse}
                            layout="grouped"
                        />
                    </OppsummeringSeksjonsgruppe>
                    <OppsummeringSeksjonsgruppe>
                        {behandlingFakta.aktiviteter && (
                            <AktivitetDagligReise
                                aktiviteter={behandlingFakta.aktiviteter}
                                layout="grouped"
                            />
                        )}
                    </OppsummeringSeksjonsgruppe>
                    <OppsummeringSeksjonsgruppe>
                        {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                            <ArbeidOgOpphold
                                fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                                layout="grouped"
                            />
                        )}
                    </OppsummeringSeksjonsgruppe>
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
