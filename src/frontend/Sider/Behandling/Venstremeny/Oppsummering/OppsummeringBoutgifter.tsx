import React from 'react';

import { BankNoteIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import Vedlegg, { antallVedlegg } from './Vedlegg';
import {
    erGyldigOppsummeringsvalg,
    InfoSeksjon,
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
    OppsummeringSeksjonsfilter,
    OppsummeringSeksjonsfilterValg,
    Søknadsdato,
} from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaBoutgifter } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    DelerUtgifterFlereStederType,
    FaktaBoligEllerOvernattingSøknadsgrunnlag,
    FaktaUtgifterFlereSteder,
    FaktaUtgifterIForbindelseMedSamling,
    FaktaUtgifterNyBolig,
} from '../../../../typer/behandling/behandlingFakta/faktaBoligEllerOvernattig';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../utils/tall';

const boutgifterSeksjoner = [oppsummeringAltFilterVerdi, 'boutgifter', 'vedlegg'] as const;
type BoutgifterSeksjon = (typeof boutgifterSeksjoner)[number];

function erBoutgifterSeksjon(value: string): value is BoutgifterSeksjon {
    return erGyldigOppsummeringsvalg(value, boutgifterSeksjoner);
}

function hentBoutgifterLabel(
    boligEllerOvernatting: FaktaBoligEllerOvernattingSøknadsgrunnlag | undefined
): string {
    const harLøpendeUtgifter = Boolean(
        boligEllerOvernatting?.fasteUtgifter?.utgifterNyBolig ||
        boligEllerOvernatting?.fasteUtgifter?.utgifterFlereSteder
    );

    if (harLøpendeUtgifter) {
        return 'Bolig';
    }

    if (boligEllerOvernatting?.samling) {
        return 'Overnatting';
    }

    return 'Boutgifter';
}

export const OppsummeringBoutgifter: React.FC<{
    behandlingFakta: BehandlingFaktaBoutgifter;
}> = ({ behandlingFakta }) => {
    const boligEllerOvernatting = behandlingFakta.boligEllerOvernatting.søknadsgrunnlag;
    const utgifterNyBolig = boligEllerOvernatting?.fasteUtgifter?.utgifterNyBolig;
    const utgifterFlereSteder = boligEllerOvernatting?.fasteUtgifter?.utgifterFlereSteder;
    const samling = boligEllerOvernatting?.samling;
    const boutgifterLabel = hentBoutgifterLabel(boligEllerOvernatting);
    const [valgtSeksjon, settValgtSeksjon] = React.useState<BoutgifterSeksjon>(
        oppsummeringAltFilterVerdi
    );
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const filtervalg: OppsummeringSeksjonsfilterValg[] = [
        oppsummeringAltFilterValg,
        ...(boligEllerOvernatting
            ? [
                  {
                      value: 'boutgifter',
                      label: boutgifterLabel,
                      ariaLabel: `Vis ${boutgifterLabel.toLowerCase()}`,
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
    const visBoligEllerOvernatting = visFellesopplysninger || valgtSeksjon === 'boutgifter';
    const visVedlegg = visFellesopplysninger || valgtSeksjon === 'vedlegg';

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
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
            {visFellesopplysninger && behandlingFakta.aktiviteter && (
                <Aktivitet aktivitet={behandlingFakta.aktiviteter}></Aktivitet>
            )}

            {visFellesopplysninger && (
                <YtelseSituasjon
                    faktaHovedytelse={behandlingFakta.hovedytelse}
                    arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
                />
            )}

            {visBoligEllerOvernatting && boligEllerOvernatting && (
                <BoligEllerOvernattingSeksjon
                    label={boutgifterLabel}
                    adresse={behandlingFakta.personopplysninger.søknadsgrunnlag?.adresse}
                    utgifterNyBolig={utgifterNyBolig}
                    utgifterFlereSteder={utgifterFlereSteder}
                    samling={samling}
                    boligEllerOvernatting={boligEllerOvernatting}
                />
            )}
            {visVedlegg && antallDokumenter > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};

export const KompaktOppsummeringsfelt: React.FC<{
    label: React.ReactNode;
    value?: React.ReactNode;
}> = ({ label, value }) => {
    if (!value) return null;

    return (
        <BodyShort size="small">
            {label}: <i>{value}</i>
        </BodyShort>
    );
};

const BoligEllerOvernattingSeksjon = ({
    label,
    adresse,
    utgifterNyBolig,
    utgifterFlereSteder,
    samling,
    boligEllerOvernatting,
}: {
    label: string;
    adresse: string | undefined;
    utgifterNyBolig: FaktaUtgifterNyBolig | undefined;
    utgifterFlereSteder: FaktaUtgifterFlereSteder | undefined;
    samling: FaktaUtgifterIForbindelseMedSamling | undefined;
    boligEllerOvernatting: FaktaBoligEllerOvernattingSøknadsgrunnlag;
}) => {
    const harSærligStoreUtgifter =
        boligEllerOvernatting.harSærligStoreUtgifterPgaFunksjonsnedsettelse === JaNei.JA;

    if (
        !adresse &&
        !utgifterNyBolig &&
        !utgifterFlereSteder &&
        !samling &&
        !harSærligStoreUtgifter
    ) {
        return null;
    }

    return (
        <InfoSeksjon label={label} ikon={<BankNoteIcon />}>
            {adresse && <Adresse adresse={adresse} />}
            <UtgifterNyBolig utgifterNyBolig={utgifterNyBolig} />
            <UtgifterFlereSteder utgifterFlereSteder={utgifterFlereSteder} />
            <UtgifterSamling samling={samling} />
            <HøyereUtgifterPgaHelse boligEllerOvernatting={boligEllerOvernatting} />
        </InfoSeksjon>
    );
};

const OppsummeringDelseksjon: React.FC<{
    label: string;
    children: React.ReactNode;
}> = ({ label, children }) => (
    <VStack gap="space-8">
        <BodyShort size="small" weight="semibold">
            {label}
        </BodyShort>
        {children}
    </VStack>
);

function Adresse({ adresse }: { adresse: string }) {
    return (
        <OppsummeringDelseksjon label="Adresse fra Folkeregisteret">
            <BodyShort size="small">{adresse}</BodyShort>
        </OppsummeringDelseksjon>
    );
}

const UtgifterNyBolig = ({
    utgifterNyBolig,
}: {
    utgifterNyBolig: FaktaUtgifterNyBolig | undefined;
}) => {
    if (!utgifterNyBolig) return null;
    return (
        <OppsummeringDelseksjon label="Løpende utgift til én bolig">
            <VStack gap="space-12">
                <div>
                    {harTallverdi(utgifterNyBolig.andelUtgifterBolig) && (
                        <KompaktOppsummeringsfelt
                            label="Utgifter ny bolig"
                            value={`${tilTallverdi(utgifterNyBolig.andelUtgifterBolig)},-`}
                        />
                    )}
                    {utgifterNyBolig.delerBoutgifter === JaNei.JA && <UtgiftenDelesMedAndre />}
                </div>
                <KompaktOppsummeringsfelt
                    label="Høyere utgift nytt bosted"
                    value={jaNeiTilTekst[utgifterNyBolig.harHoyereUtgifterPaNyttBosted]}
                />
                {utgifterNyBolig.mottarBostotte === JaNei.JA && (
                    <KompaktOppsummeringsfelt label="Mottar bostøtte" value="Ja" />
                )}
            </VStack>
        </OppsummeringDelseksjon>
    );
};

function UtgiftenDelesMedAndre() {
    return (
        <BodyShort size="small">
            <i>utgiften deles med andre</i>
        </BodyShort>
    );
}

const UtgifterFlereSteder = ({
    utgifterFlereSteder,
}: {
    utgifterFlereSteder: FaktaUtgifterFlereSteder | undefined;
}) => {
    if (!utgifterFlereSteder) return null;
    return (
        <OppsummeringDelseksjon label="Løpende utgift til to boliger">
            <VStack gap="space-8">
                <div>
                    <KompaktOppsummeringsfelt
                        label="Utgift hjemsted"
                        value={`${tilTallverdi(utgifterFlereSteder.andelUtgifterBoligHjemsted)},-`}
                    />
                    {utgifterFlereSteder.delerBoutgifter.includes(
                        DelerUtgifterFlereStederType.HJEMSTED
                    ) && <UtgiftenDelesMedAndre />}
                </div>
                <div>
                    <KompaktOppsummeringsfelt
                        label="Utgift aktivitetssted"
                        value={`${tilTallverdi(utgifterFlereSteder.andelUtgifterBoligAktivitetssted)},-`}
                    />
                    {utgifterFlereSteder.delerBoutgifter.includes(
                        DelerUtgifterFlereStederType.AKTIVITETSSTED
                    ) && <UtgiftenDelesMedAndre />}
                </div>
            </VStack>
        </OppsummeringDelseksjon>
    );
};

const UtgifterSamling = ({
    samling,
}: {
    samling: FaktaUtgifterIForbindelseMedSamling | undefined;
}) => {
    if (!samling) return null;
    return (
        <OppsummeringDelseksjon label="Utgifter til overnatting">
            <VStack gap="space-8">
                {samling.periodeForSamling.map((periode, index) => {
                    return (
                        <div key={index}>
                            {harTallverdi(periode.utgifterTilOvernatting) && (
                                <KompaktOppsummeringsfelt
                                    label={formaterIsoPeriode(periode.fom, periode.tom)}
                                    value={`${tilTallverdi(periode.utgifterTilOvernatting)},-`}
                                />
                            )}
                            {periode.trengteEkstraOvernatting === JaNei.JA && (
                                <BodyShort size="small">
                                    <i>Trengte ekstra overnatting</i>
                                </BodyShort>
                            )}
                        </div>
                    );
                })}
            </VStack>
        </OppsummeringDelseksjon>
    );
};

const HøyereUtgifterPgaHelse = ({
    boligEllerOvernatting,
}: {
    boligEllerOvernatting: FaktaBoligEllerOvernattingSøknadsgrunnlag;
}) => {
    const særligUtgifter = boligEllerOvernatting.harSærligStoreUtgifterPgaFunksjonsnedsettelse;
    return (
        særligUtgifter === JaNei.JA && (
            <BodyShort size="small">
                <i>
                    <WheelchairIcon /> Har særlig store utgifter på grunn av funksjonsnedsettelse
                </i>
            </BodyShort>
        )
    );
};
