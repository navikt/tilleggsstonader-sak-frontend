import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';

import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoFelt, SøknadInfoSeksjon, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaFlytting } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    FaktaFlytteadresse,
    FaktaFlyttetilbud,
    flytteårsakTilTekst,
    flyttemåteTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaFlytting';
import { jaNeiTilTekst } from '../../../../typer/common';
import { formaterDato } from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

function adresseLinjer(adresse?: FaktaFlytteadresse): string[] {
    return [
        adresse?.landkode,
        adresse?.gateadresse,
        [adresse?.postnummer, adresse?.poststed].filter(Boolean).join(' '),
    ].filter((linje): linje is string => Boolean(linje));
}

function formaterKroner(beløp?: number) {
    return beløp !== undefined && beløp !== null
        ? `${formaterTallMedTusenSkille(beløp)} kr`
        : undefined;
}

function tilbudTilTekst(tilbud: FaktaFlyttetilbud) {
    return [tilbud.navn, formaterKroner(tilbud.beløp)].filter(Boolean).join(', ');
}

export const OppsummeringFlytting: React.FC<{
    behandlingFakta: BehandlingFaktaFlytting;
}> = ({ behandlingFakta }) => {
    const detaljer = behandlingFakta.flyttingDetaljer;
    const utgifter = detaljer?.utgifterEgenFlytting;

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <YtelseSituasjon
                faktaHovedytelse={behandlingFakta.hovedytelse}
                arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
            />
            {detaljer && (
                <SøknadInfoSeksjon label="Flytting" ikon={<CardIcon />}>
                    <SøknadInfoFelt
                        label="Årsak til flytting"
                        value={detaljer.årsak && flytteårsakTilTekst[detaljer.årsak]}
                    />
                    <SøknadInfoFelt
                        label="Dato for flytting"
                        value={detaljer.flyttedato && formaterDato(detaljer.flyttedato)}
                    />
                    <SøknadInfoFelt label="Ny adresse" value={adresseLinjer(detaljer.adresse)} />
                    <SøknadInfoFelt
                        label="Flyttemåte"
                        value={detaljer.flyttemåte && flyttemåteTilTekst[detaljer.flyttemåte]}
                    />
                    <SøknadInfoFelt
                        label="Får dekket utgiftene på annen måte"
                        value={
                            detaljer.utgifterDekketPåAnnenMåte &&
                            jaNeiTilTekst[detaljer.utgifterDekketPåAnnenMåte]
                        }
                    />
                    <SøknadInfoFelt
                        label="Avstand"
                        value={
                            utgifter?.avstand !== undefined && utgifter?.avstand !== null
                                ? `${formaterTallMedTusenSkille(utgifter.avstand)} km`
                                : undefined
                        }
                    />
                    <SøknadInfoFelt
                        label="Leie av henger"
                        value={formaterKroner(utgifter?.hengerleie)}
                    />
                    <SøknadInfoFelt label="Bom" value={formaterKroner(utgifter?.bom)} />
                    <SøknadInfoFelt label="Parkering" value={formaterKroner(utgifter?.parkering)} />
                    <SøknadInfoFelt label="Ferje" value={formaterKroner(utgifter?.ferje)} />
                    <SøknadInfoFelt
                        label="Andre utgifter"
                        value={formaterKroner(utgifter?.annet)}
                    />
                    {detaljer.flyttetilbud?.map((tilbud, index) => (
                        <SøknadInfoFelt
                            key={index}
                            label={`Tilbud ${index + 1}`}
                            value={tilbudTilTekst(tilbud)}
                        />
                    ))}
                </SøknadInfoSeksjon>
            )}
            {antallVedlegg(behandlingFakta.dokumentasjon) > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};
