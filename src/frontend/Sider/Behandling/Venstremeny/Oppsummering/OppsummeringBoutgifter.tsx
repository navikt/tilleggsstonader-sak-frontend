import React from 'react';

import { BankNoteIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import { Aktivitet } from './Aktivitet';
import { useOppsummeringFilter } from './UseOppsummeringFilter';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import {
    InfoSeksjon,
    KompaktOppsummeringsfelt,
    OppsummeringFelt,
    OppsummeringSeksjonsfilter,
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
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const {
        filtervalg,
        visFellesopplysninger,
        visSeksjon,
        visVedlegg,
        onFilterChange,
        valgtSeksjon,
    } = useOppsummeringFilter(
        boligEllerOvernatting
            ? [
                  {
                      value: 'boutgifter',
                      label: boutgifterLabel,
                      ariaLabel: `Vis ${boutgifterLabel.toLowerCase()}`,
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for boutgifter"
                onChange={onFilterChange}
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

            {visSeksjon('boutgifter') && boligEllerOvernatting && (
                <BoligEllerOvernattingSeksjon
                    label={boutgifterLabel}
                    adresse={behandlingFakta.personopplysninger.søknadsgrunnlag?.adresse}
                    utgifterNyBolig={utgifterNyBolig}
                    utgifterFlereSteder={utgifterFlereSteder}
                    samling={samling}
                    boligEllerOvernatting={boligEllerOvernatting}
                />
            )}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
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
                {harTallverdi(utgifterNyBolig.andelUtgifterBolig) && (
                    <KompaktOppsummeringsfelt
                        label="Andel av utgift"
                        value={`${tilTallverdi(utgifterNyBolig.andelUtgifterBolig)} kr`}
                    />
                )}
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
                        value={`${tilTallverdi(utgifterFlereSteder.andelUtgifterBoligHjemsted)} kr`}
                    />
                    {utgifterFlereSteder.delerBoutgifter.includes(
                        DelerUtgifterFlereStederType.HJEMSTED
                    ) && <UtgiftenDelesMedAndre />}
                </div>
                <div>
                    <KompaktOppsummeringsfelt
                        label="Utgift aktivitetssted"
                        value={`${tilTallverdi(utgifterFlereSteder.andelUtgifterBoligAktivitetssted)} kr`}
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
                                    value={`${tilTallverdi(periode.utgifterTilOvernatting)} kr`}
                                />
                            )}
                            {periode.trengteEkstraOvernatting === JaNei.JA && (
                                <BodyShort size="small">
                                    <i>Hadde ekstra overnatting</i>
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
            <OppsummeringFelt
                label="Trenger du tilpasset bolig på grunn av helseutfordringer?"
                ikon={<WheelchairIcon />}
                value={
                    <BodyShort size="small">
                        <i>{jaNeiTilTekst[særligUtgifter]}</i>
                    </BodyShort>
                }
            />
        )
    );
};
