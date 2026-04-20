import React from 'react';

import { BankNoteIcon, LocationPinIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import Vedlegg, { antallVedlegg } from './Vedlegg';
import {
    erGyldigOppsummeringsvalg,
    InfoSeksjon,
    oppsummeringAltFilterValg,
    oppsummeringAltFilterVerdi,
    OppsummeringFelt,
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
            ? [
                  {
                      value: 'boutgifter',
                      label: 'Boutgifter',
                      ariaLabel: 'Vis bolig og overnatting',
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
    const visBolig = visFellesopplysninger || valgtSeksjon === 'boutgifter';
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

            {visBolig && behandlingFakta.personopplysninger.søknadsgrunnlag?.adresse && (
                <InfoSeksjon label="Adresse" ikon={<LocationPinIcon />}>
                    <BodyShort size="small">
                        {behandlingFakta.personopplysninger.søknadsgrunnlag.adresse}
                    </BodyShort>
                </InfoSeksjon>
            )}
            {visBolig && boligEllerOvernatting && (
                <>
                    <UtgifterNyBolig utgifterNyBolig={utgifterNyBolig} />
                    <UtgifterFlereSteder utgifterFlereSteder={utgifterFlereSteder} />
                    <UtgifterSamling samling={samling} />
                    <HøyereUtgifterPgaHelse boligEllerOvernatting={boligEllerOvernatting} />
                </>
            )}
            {visVedlegg && antallDokumenter > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};

const KompaktOppsummeringsfelt: React.FC<{
    label: string;
    value: string;
}> = ({ label, value }) => (
    <BodyShort size="small">
        <strong>{label}:</strong> {value}
    </BodyShort>
);

const UtgifterNyBolig = ({
    utgifterNyBolig,
}: {
    utgifterNyBolig: FaktaUtgifterNyBolig | undefined;
}) => {
    if (!utgifterNyBolig) return null;
    return (
        <InfoSeksjon label="Løpende utgift til én bolig" ikon={<BankNoteIcon />}>
            <VStack gap="space-8">
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
        </InfoSeksjon>
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
        <InfoSeksjon label="Løpende utgift til to boliger" ikon={<BankNoteIcon />}>
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
        </InfoSeksjon>
    );
};

const UtgifterSamling = ({
    samling,
}: {
    samling: FaktaUtgifterIForbindelseMedSamling | undefined;
}) => {
    if (!samling) return null;
    return (
        <InfoSeksjon label="Utgifter til overnatting" ikon={<BankNoteIcon />}>
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
        </InfoSeksjon>
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
