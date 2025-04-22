import React from 'react';

import { BankNoteIcon, CalendarIcon, LocationPinIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { BehandlingFaktaBoutgifter } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    delerUtgifterFlereStederTypeTilTekst,
    FaktaUtgifterFlereSteder,
    FaktaUtgifterIForbindelseMedSamling,
    FaktaUtgifterNyBolig,
} from '../../../../typer/behandling/behandlingFakta/faktaBoligEllerOvernattig';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterDato, formaterIsoPeriode } from '../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../utils/tall';

export const OppsummeringBoutgifter: React.FC<{
    behandlingFakta: BehandlingFaktaBoutgifter;
}> = ({ behandlingFakta }) => {
    const boligEllerOvernatting = behandlingFakta.boligEllerOvernatting.søknadsgrunnlag;
    const utgifterNyBolig = boligEllerOvernatting?.fasteUtgifter?.utgifterNyBolig;
    const utgifterFlereSteder = boligEllerOvernatting?.fasteUtgifter?.utgifterFlereSteder;
    const samling = boligEllerOvernatting?.samling;
    return (
        <>
            {behandlingFakta.søknadMottattTidspunkt && (
                <InfoSeksjon label="Søknadsdato" ikon={<CalendarIcon />}>
                    <BodyShort size="small">
                        {formaterDato(behandlingFakta.søknadMottattTidspunkt)}
                    </BodyShort>
                </InfoSeksjon>
            )}

            {behandlingFakta.personopplysninger.søknadsgrunnlag && (
                <InfoSeksjon label="Adresse" ikon={<LocationPinIcon />}>
                    <BodyShort size="small">
                        {behandlingFakta.personopplysninger.søknadsgrunnlag?.adresse}
                    </BodyShort>
                </InfoSeksjon>
            )}

            <Hovedytelse faktaHovedytelse={behandlingFakta.hovedytelse} />

            {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                <ArbeidOgOpphold
                    fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                />
            )}

            {behandlingFakta.aktiviteter && (
                <Aktivitet aktivitet={behandlingFakta.aktiviteter}></Aktivitet>
            )}

            {boligEllerOvernatting && (
                <>
                    <InfoSeksjon label={'Bolig/overnatting'} ikon={<BankNoteIcon />}>
                        <UtgifterNyBolig utgifterNyBolig={utgifterNyBolig} />
                        <UtgifterFlereSteder utgifterFlereSteder={utgifterFlereSteder} />
                        <UtgifterSamling samling={samling} />
                    </InfoSeksjon>
                    <InfoSeksjon label={'Høyere utgift pga helse'} ikon={<WheelchairIcon />}>
                        <BodyShort size={'small'}>
                            Trenger tilpasset bolig:{' '}
                            {
                                jaNeiTilTekst[
                                    boligEllerOvernatting
                                        .harSærligStoreUtgifterPgaFunksjonsnedsettelse
                                ]
                            }
                        </BodyShort>
                    </InfoSeksjon>
                </>
            )}
            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
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
        <>
            <BodyShort weight={'semibold'}>Løpende utgift 1 bolig</BodyShort>
            <BodyShort size={'small'}>
                Deler utgifter: {jaNeiTilTekst[utgifterNyBolig.delerBoutgifter]}
            </BodyShort>
            {harTallverdi(utgifterNyBolig.andelUtgifterBolig) && (
                <BodyShort size={'small'}>
                    Utgifter ny bolig: {tilTallverdi(utgifterNyBolig.andelUtgifterBolig)},-
                </BodyShort>
            )}
            <BodyShort size={'small'}>
                Høyere utgift nytt bosted:{' '}
                {jaNeiTilTekst[utgifterNyBolig.harHoyereUtgifterPaNyttBosted]}
            </BodyShort>
            {utgifterNyBolig.mottarBostotte === JaNei.JA && (
                <BodyShort size={'small'}>Mottar bostøtte</BodyShort>
            )}
        </>
    );
};

const UtgifterFlereSteder = ({
    utgifterFlereSteder,
}: {
    utgifterFlereSteder: FaktaUtgifterFlereSteder | undefined;
}) => {
    if (!utgifterFlereSteder) return null;
    return (
        <>
            <BodyShort weight={'semibold'}>Løpende utgift 2 boliger</BodyShort>
            <BodyShort size={'small'}>
                Deler utgifter:{' '}
                {utgifterFlereSteder.delerBoutgifter
                    .map((delerBoutgift) => delerUtgifterFlereStederTypeTilTekst[delerBoutgift])
                    .join(', ')}
            </BodyShort>
            <BodyShort size={'small'}>
                Utgift hjemsted: {tilTallverdi(utgifterFlereSteder.andelUtgifterBoligHjemsted)},-
            </BodyShort>
            <BodyShort size={'small'}>
                Utgift ny bolig:{' '}
                {tilTallverdi(utgifterFlereSteder.andelUtgifterBoligAktivitetssted)}
                ,-
            </BodyShort>
        </>
    );
};

const UtgifterSamling = ({
    samling,
}: {
    samling: FaktaUtgifterIForbindelseMedSamling | undefined;
}) => {
    if (!samling) return null;
    return (
        <>
            <BodyShort weight={'semibold'}>Utgifter til overnatting</BodyShort>
            <VStack gap={'3'}>
                {samling.periodeForSamling.map((periode, index) => (
                    <div key={index}>
                        <BodyShort size={'small'}>
                            {formaterIsoPeriode(periode.fom, periode.tom)}:{' '}
                            {tilTallverdi(periode.utgifterTilOvernatting)},-
                        </BodyShort>
                        {periode.trengteEkstraOvernatting === JaNei.JA && (
                            <BodyShort size={'small'}>Ekstra overnatting</BodyShort>
                        )}
                    </div>
                ))}
            </VStack>
        </>
    );
};
