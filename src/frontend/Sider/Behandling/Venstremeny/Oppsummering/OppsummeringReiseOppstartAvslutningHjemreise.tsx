import React from 'react';

import { ChildEyesIcon, EarthIcon, HouseIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { Aktivitet } from './Aktivitet';
import { DrosjeDetaljer } from './SamlingsDetaljer/DrosjeDetaljer';
import { OffentligTransportDetaljer } from './SamlingsDetaljer/OffentligTransportDetaljer';
import { PrivatBilDetaljer } from './SamlingsDetaljer/PrivatBilDetaljer';
import { UnntakFraOffentligTransportDetaljer } from './SamlingsDetaljer/UnntakFraOffentligTransportDetaljer';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import {
    SøknadInfoEkspanderbar,
    SøknadInfoFelt,
    SøknadInfoSeksjon,
    Søknadsdato,
} from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaReiseOppstartAvslutningHjemreise } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    FaktaROAHAdresse,
    FaktaROAHAdresser,
    FaktaROAHBarnOgSærligeBehov,
    ROAHTypeReise,
} from '../../../../typer/behandling/behandlingFakta/faktaROAH';
import {
    årsakKanIkkeBenytteEgenBilTilTekst,
    FaktaReisemåte,
    transportmiddelTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterDato } from '../../../../utils/dato';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

const reisetypeTilTekst: Record<ROAHTypeReise, string> = {
    OPPSTART: 'Reise ved oppstart',
    AVSLUTNING: 'Reise ved avslutning',
    HJEMREISE: 'Hjemreise',
};

function formaterAdresse(adresse?: FaktaROAHAdresse): string[] {
    if (!adresse) {
        return [];
    }

    const linjer = [adresse.landkode, adresse.gateadresse].filter(
        (linje): linje is string => typeof linje === 'string'
    );
    const postadresse = [adresse.postnummer, adresse.poststed]
        .filter((verdi): verdi is string => typeof verdi === 'string')
        .join(' ');

    if (postadresse) {
        linjer.push(postadresse);
    }

    return linjer;
}

function formaterPeriode(fom?: string, tom?: string): string | undefined {
    const fomFormatert = fom ? formaterDato(fom) : undefined;
    const tomFormatert = tom ? formaterDato(tom) : undefined;

    if (fomFormatert && tomFormatert) {
        return `${fomFormatert}–${tomFormatert}`;
    }
    if (fomFormatert) {
        return `Fra ${fomFormatert}`;
    }
    if (tomFormatert) {
        return `Til ${tomFormatert}`;
    }
    return undefined;
}

function svarTilTekst(svar?: JaNei) {
    return svar == null ? undefined : jaNeiTilTekst[svar];
}

const Adresser: React.FC<{
    fakta: FaktaROAHAdresser;
}> = ({ fakta }) => (
    <SøknadInfoSeksjon label="Bosted og adresser" ikon={<HouseIcon aria-hidden />}>
        <SøknadInfoFelt
            label="Må du bo borte fra hjemmet?"
            value={svarTilTekst(fakta.måBoBorteHjemmefra)}
        />
        {fakta.periodeMidlertidigBosted && (
            <SøknadInfoFelt
                label="Periode for midlertidig bosted"
                value={formaterPeriode(
                    fakta.periodeMidlertidigBosted.fomFlyttedato,
                    fakta.periodeMidlertidigBosted.tomFlyttedato
                )}
            />
        )}
        {fakta.adresseOriginaltBosted && (
            <>
                <SøknadInfoFelt
                    label="Skal du reise fra folkeregistrert adresse?"
                    value={svarTilTekst(
                        fakta.adresseOriginaltBosted.skalReiseFraFolkeregistrertAdresse
                    )}
                />
                <SøknadInfoFelt
                    label="Opprinnelig adresse"
                    value={formaterAdresse(fakta.adresseOriginaltBosted.adresseOriginaltBosted)}
                />
            </>
        )}
        <SøknadInfoFelt
            label="Midlertidig adresse"
            value={formaterAdresse(fakta.adresseMidlertidigBosted)}
        />
    </SøknadInfoSeksjon>
);

const BarnOgSærligeBehov: React.FC<{
    fakta: FaktaROAHBarnOgSærligeBehov;
}> = ({ fakta }) => (
    <SøknadInfoSeksjon label="Barn og særlige behov" ikon={<ChildEyesIcon aria-hidden />}>
        <SøknadInfoFelt
            label="Har du barn under 18 år som flytter med deg?"
            value={svarTilTekst(fakta.harBarnUnder18SomHarFlyttetMed)}
        />
        <SøknadInfoFelt
            label="Hvilke barn flytter med deg?"
            value={fakta.hvilkeBarnFlytterMed ?? undefined}
        />
        <SøknadInfoFelt
            label="Har du barn hjemme under 4. klasse?"
            value={svarTilTekst(fakta.harBarnHjemmeUnder4Klasse)}
        />
        <SøknadInfoFelt
            label="Har du særlige behov for flere hjemreiser?"
            value={svarTilTekst(fakta.harSærligeBehovForFlereHjemreiser)}
        />
    </SøknadInfoSeksjon>
);

const TransportDetaljer: React.FC<{ reisemåte?: FaktaReisemåte }> = ({ reisemåte }) => {
    if (!reisemåte) {
        return null;
    }

    return (
        <>
            {reisemåte.hvilkeTransportmidlerBleBenyttet &&
                reisemåte.hvilkeTransportmidlerBleBenyttet.length > 0 && (
                    <SøknadInfoFelt
                        label="Hvilke transportmidler brukte du?"
                        value={reisemåte.hvilkeTransportmidlerBleBenyttet
                            .map((transportmiddel) =>
                                tekstMedFallback(transportmiddelTilTekst, transportmiddel)
                            )
                            .join(', ')}
                    />
                )}
            {reisemåte.unntakFraOffentligTransport && (
                <UnntakFraOffentligTransportDetaljer
                    unntakFraOffentligTransport={reisemåte.unntakFraOffentligTransport}
                />
            )}
            {reisemåte.unntakFraPrivatBil && reisemåte.unntakFraPrivatBil.length > 0 && (
                <SøknadInfoFelt
                    label="Hvorfor kan du ikke kjøre egen bil hele veien?"
                    value={reisemåte.unntakFraPrivatBil
                        .map((årsak) => tekstMedFallback(årsakKanIkkeBenytteEgenBilTilTekst, årsak))
                        .join(', ')}
                />
            )}
            {reisemåte.offentligTransport?.totalUtgifterOffentligTransport != null && (
                <OffentligTransportDetaljer offentligTransport={reisemåte.offentligTransport} />
            )}
            {reisemåte.privatBil && <PrivatBilDetaljer privatBil={reisemåte.privatBil} />}
            {reisemåte.drosje && <DrosjeDetaljer drosje={reisemåte.drosje} />}
        </>
    );
};

export const OppsummeringReiseOppstartAvslutningHjemreise: React.FC<{
    behandlingFakta: BehandlingFaktaReiseOppstartAvslutningHjemreise;
}> = ({ behandlingFakta }) => (
    <>
        <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt ?? undefined} />
        {behandlingFakta.hovedytelse && (
            <YtelseSituasjon
                faktaHovedytelse={behandlingFakta.hovedytelse}
                arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
            />
        )}
        {behandlingFakta.aktivitet?.søknadsgrunnlag && (
            <Aktivitet aktivitet={behandlingFakta.aktivitet} />
        )}
        {behandlingFakta.adresser && <Adresser fakta={behandlingFakta.adresser} />}
        {behandlingFakta.barnOgSærligeBehov && (
            <BarnOgSærligeBehov fakta={behandlingFakta.barnOgSærligeBehov} />
        )}
        {behandlingFakta.reiser.length > 0 && (
            <SøknadInfoSeksjon label="Reiser" ikon={<EarthIcon aria-hidden />}>
                <VStack gap="space-12">
                    {behandlingFakta.reiser.map((reise, index) => (
                        <SøknadInfoEkspanderbar
                            ikon={<EarthIcon aria-hidden />}
                            key={index}
                            tittel={`Reise ${index + 1}`}
                            variant="subtle"
                        >
                            <SøknadInfoFelt
                                label="Type reise"
                                value={
                                    reise.typeReise ? reisetypeTilTekst[reise.typeReise] : undefined
                                }
                            />
                            <SøknadInfoFelt
                                label="Periode"
                                value={formaterPeriode(reise.fom, reise.tom)}
                            />
                            <TransportDetaljer reisemåte={reise.reisemåte} />
                        </SøknadInfoEkspanderbar>
                    ))}
                </VStack>
            </SøknadInfoSeksjon>
        )}
        {antallVedlegg(behandlingFakta.dokumentasjon ?? undefined) > 0 && (
            <Vedlegg fakta={behandlingFakta.dokumentasjon ?? undefined} />
        )}
    </>
);
