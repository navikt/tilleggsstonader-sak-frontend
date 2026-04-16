import React from 'react';

import { BankNoteIcon, CalendarIcon, LocationPinIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import Vedlegg, { antallVedlegg } from './Vedlegg';
import {
    erGyldigOppsummeringsvalg,
    InfoSeksjon,
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
    OppsummeringFelt,
    OppsummeringFeltgruppe,
    OppsummeringSeksjonsfilter,
    OppsummeringSeksjonsfilterValg,
} from './Visningskomponenter';
import YtelseSituasjon from './YtelseSituasjon';
import { BehandlingFaktaBoutgifter } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    DelerUtgifterFlereStederType,
    delerUtgifterFlereStederTypeTilTekst,
    FaktaBoligEllerOvernattingSøknadsgrunnlag,
    FaktaUtgifterFlereSteder,
    FaktaUtgifterIForbindelseMedSamling,
    FaktaUtgifterNyBolig,
} from '../../../../typer/behandling/behandlingFakta/faktaBoligEllerOvernattig';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterDato, formaterIsoPeriode } from '../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../utils/tall';

const boutgifterSeksjoner = [oppsummeringAltFilterVerdi, 'bolig', 'vedlegg'] as const;
type BoutgifterSeksjon = (typeof boutgifterSeksjoner)[number];

function erBoutgifterSeksjon(value: string): value is BoutgifterSeksjon {
    return erGyldigOppsummeringsvalg(value, boutgifterSeksjoner);
}

export const OppsummeringBoutgifter: React.FC<{
    behandlingFakta: BehandlingFaktaBoutgifter;
}> = ({ behandlingFakta }) => {
    const boligEllerOvernatting = behandlingFakta.boligEllerOvernatting.søknadsgrunnlag;
    const utgifterNyBolig = boligEllerOvernatting?.fasteUtgifter?.utgifterNyBolig;
    const utgifterFlereSteder = boligEllerOvernatting?.fasteUtgifter?.utgifterFlereSteder;
    const samling = boligEllerOvernatting?.samling;
    const [valgtSeksjon, settValgtSeksjon] = React.useState<BoutgifterSeksjon>(
        oppsummeringAltFilterVerdi
    );
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const filtervalg: OppsummeringSeksjonsfilterValg[] = [
        oppsummeringAltFilterValg,
        ...(boligEllerOvernatting
            ? [{ value: 'bolig', label: 'Bolig', ariaLabel: 'Vis bolig og overnatting' }]
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
    const visBolig = visFellesopplysninger || valgtSeksjon === 'bolig';
    const visVedlegg = visFellesopplysninger || valgtSeksjon === 'vedlegg';

    return (
        <>
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for boutgifter"
                onChange={(value) => {
                    if (erBoutgifterSeksjon(value)) {
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

            {visFellesopplysninger &&
                behandlingFakta.personopplysninger.søknadsgrunnlag?.adresse && (
                    <InfoSeksjon label="Adresse" ikon={<LocationPinIcon />}>
                        <BodyShort size="small">
                            {behandlingFakta.personopplysninger.søknadsgrunnlag.adresse}
                        </BodyShort>
                    </InfoSeksjon>
                )}

            {visFellesopplysninger && (
                <YtelseSituasjon
                    faktaHovedytelse={behandlingFakta.hovedytelse}
                    arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
                />
            )}

            {visFellesopplysninger && behandlingFakta.aktiviteter && (
                <Aktivitet aktivitet={behandlingFakta.aktiviteter}></Aktivitet>
            )}

            {visBolig && boligEllerOvernatting && (
                <>
                    <InfoSeksjon label={'Bolig / overnatting'} ikon={<BankNoteIcon />}>
                        <UtgifterNyBolig utgifterNyBolig={utgifterNyBolig} />
                        <UtgifterFlereSteder utgifterFlereSteder={utgifterFlereSteder} />
                        <UtgifterSamling samling={samling} />
                    </InfoSeksjon>
                    <HøyereUtgifterPgaHelse boligEllerOvernatting={boligEllerOvernatting} />
                </>
            )}
            {visVedlegg && antallDokumenter > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};

const UtgifterNyBolig = ({
    utgifterNyBolig,
}: {
    utgifterNyBolig: FaktaUtgifterNyBolig | undefined;
}) => {
    if (!utgifterNyBolig) return null;
    return (
        <VStack gap="space-8">
            <BodyShort size={'small'} weight={'semibold'}>
                Løpende utgift 1 bolig
            </BodyShort>
            <OppsummeringFeltgruppe>
                {utgifterNyBolig.delerBoutgifter === JaNei.JA && (
                    <OppsummeringFelt
                        label="Deler utgifter"
                        value={jaNeiTilTekst[utgifterNyBolig.delerBoutgifter]}
                    />
                )}
                {harTallverdi(utgifterNyBolig.andelUtgifterBolig) && (
                    <OppsummeringFelt
                        label="Utgifter ny bolig"
                        value={`${tilTallverdi(utgifterNyBolig.andelUtgifterBolig)},-`}
                    />
                )}
                <OppsummeringFelt
                    label="Høyere utgift nytt bosted"
                    value={jaNeiTilTekst[utgifterNyBolig.harHoyereUtgifterPaNyttBosted]}
                />
                {utgifterNyBolig.mottarBostotte === JaNei.JA && (
                    <OppsummeringFelt label="Mottar bostøtte" value="Ja" />
                )}
            </OppsummeringFeltgruppe>
        </VStack>
    );
};

const UtgifterFlereSteder = ({
    utgifterFlereSteder,
}: {
    utgifterFlereSteder: FaktaUtgifterFlereSteder | undefined;
}) => {
    if (!utgifterFlereSteder) return null;
    const typerDelerBoutgifter = utgifterFlereSteder.delerBoutgifter;
    const delerUtgifter =
        typerDelerBoutgifter.length > 0 &&
        !(
            typerDelerBoutgifter.length === 1 &&
            typerDelerBoutgifter[0] === DelerUtgifterFlereStederType.NEI
        );
    return (
        <VStack gap="space-8">
            <BodyShort size={'small'} weight={'semibold'}>
                Løpende utgift 2 boliger
            </BodyShort>
            <OppsummeringFeltgruppe>
                {delerUtgifter && (
                    <OppsummeringFelt
                        label="Deler utgifter"
                        value={typerDelerBoutgifter
                            .map(
                                (delerBoutgift) =>
                                    delerUtgifterFlereStederTypeTilTekst[delerBoutgift]
                            )
                            .join(', ')}
                    />
                )}
                <OppsummeringFelt
                    label="Utgift hjemsted"
                    value={`${tilTallverdi(utgifterFlereSteder.andelUtgifterBoligHjemsted)},-`}
                />
                <OppsummeringFelt
                    label="Utgift aktivitetssted"
                    value={`${tilTallverdi(utgifterFlereSteder.andelUtgifterBoligAktivitetssted)},-`}
                />
            </OppsummeringFeltgruppe>
        </VStack>
    );
};

const UtgifterSamling = ({
    samling,
}: {
    samling: FaktaUtgifterIForbindelseMedSamling | undefined;
}) => {
    if (!samling) return null;
    return (
        <VStack gap={'space-8'}>
            <BodyShort size={'small'} weight={'semibold'}>
                Utgifter til overnatting
            </BodyShort>
            <OppsummeringFeltgruppe>
                {samling.periodeForSamling.map((periode, index) => (
                    <OppsummeringFelt
                        key={index}
                        label={formaterIsoPeriode(periode.fom, periode.tom)}
                    >
                        <VStack gap="space-4">
                            <BodyShort size="small">
                                {harTallverdi(periode.utgifterTilOvernatting)
                                    ? `${tilTallverdi(periode.utgifterTilOvernatting)},-`
                                    : '-'}
                            </BodyShort>
                            {periode.trengteEkstraOvernatting === JaNei.JA && (
                                <BodyShort size="small">Ekstra overnatting</BodyShort>
                            )}
                        </VStack>
                    </OppsummeringFelt>
                ))}
            </OppsummeringFeltgruppe>
        </VStack>
    );
};

const HøyereUtgifterPgaHelse = ({
    boligEllerOvernatting,
}: {
    boligEllerOvernatting: FaktaBoligEllerOvernattingSøknadsgrunnlag;
}) => {
    return (
        boligEllerOvernatting.harSærligStoreUtgifterPgaFunksjonsnedsettelse === JaNei.JA && (
            <InfoSeksjon label={'Særlig store utgifter'} ikon={<WheelchairIcon />}>
                <OppsummeringFelt
                    label="Har særlig store utgifter på grunn av funksjonsnedsettelse"
                    value={
                        jaNeiTilTekst[
                            boligEllerOvernatting.harSærligStoreUtgifterPgaFunksjonsnedsettelse
                        ]
                    }
                />
            </InfoSeksjon>
        )
    );
};
