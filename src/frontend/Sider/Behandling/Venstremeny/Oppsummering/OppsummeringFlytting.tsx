import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';

import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoFelt, SøknadInfoSeksjon, Søknadsdato } from './Visningskomponenter';
import { BehandlingFaktaFlytting } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { FlyttingDetaljer } from '../../../../typer/behandling/behandlingFakta/faktaFlytting';
import { formaterDato } from '../../../../utils/dato';

function visDato(felt?: { verdi: string } | null) {
    return felt?.verdi ? (formaterDato(felt.verdi) ?? felt.verdi) : undefined;
}

function adresseLinjer(flyttingDetaljer: FlyttingDetaljer) {
    const adresse = flyttingDetaljer.adresse;
    return [
        adresse?.land?.svarTekst,
        adresse?.gateadresse?.verdi,
        [adresse?.postnummer?.verdi, adresse?.poststed?.verdi].filter(Boolean).join(' '),
    ].filter((linje): linje is string => Boolean(linje));
}

function tilbudstekst(
    tilbud?: {
        navn?: { label: string; verdi: string } | null;
        beløp?: { label: string; verdi: number } | null;
    } | null
) {
    return [tilbud?.navn, tilbud?.beløp].flatMap((felt) =>
        felt && felt.verdi !== '' ? [`${felt.label}: ${felt.verdi}`] : []
    );
}

export const OppsummeringFlytting: React.FC<{
    behandlingFakta: BehandlingFaktaFlytting;
}> = ({ behandlingFakta }) => {
    const detaljer = behandlingFakta.flyttingDetaljer;
    const adresse = detaljer ? adresseLinjer(detaljer) : [];
    const utgifter = detaljer?.utgifterEgenFlytting;
    const flyttebyrå = detaljer?.flyttebyrå;

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            {detaljer && (
                <SøknadInfoSeksjon label="Flytting" ikon={<CardIcon />}>
                    <SøknadInfoFelt
                        label={detaljer.årsak?.label ?? 'Årsak til flytting'}
                        value={detaljer.årsak?.svarTekst}
                    />
                    <SøknadInfoFelt
                        label={detaljer.flyttedato?.label ?? 'Dato for flytting'}
                        value={visDato(detaljer.flyttedato)}
                    />
                    <SøknadInfoFelt label="Ny adresse" value={adresse} />
                    <SøknadInfoFelt
                        label={detaljer.flyttemåte?.label ?? 'Hvordan skal du flytte?'}
                        value={detaljer.flyttemåte?.svarTekst}
                    />
                    <SøknadInfoFelt
                        label={
                            detaljer.utgifterDekketPåAnnenMåte?.label ??
                            'Får du dekket utgiftene på annen måte?'
                        }
                        value={detaljer.utgifterDekketPåAnnenMåte?.svarTekst}
                    />
                    <SøknadInfoFelt
                        label={utgifter?.avstand?.label ?? 'Avstand'}
                        value={utgifter?.avstand?.verdi}
                    />
                    <SøknadInfoFelt
                        label={utgifter?.hengerleie?.label ?? 'Leie av henger'}
                        value={utgifter?.hengerleie?.verdi}
                    />
                    <SøknadInfoFelt
                        label={utgifter?.bom?.label ?? 'Bom'}
                        value={utgifter?.bom?.verdi}
                    />
                    <SøknadInfoFelt
                        label={utgifter?.parkering?.label ?? 'Parkering'}
                        value={utgifter?.parkering?.verdi}
                    />
                    <SøknadInfoFelt
                        label={utgifter?.ferje?.label ?? 'Ferje'}
                        value={utgifter?.ferje?.verdi}
                    />
                    <SøknadInfoFelt
                        label={utgifter?.annet?.label ?? 'Andre utgifter'}
                        value={utgifter?.annet?.verdi}
                    />
                    {flyttebyrå?.tilbud.map((tilbud, index) => {
                        const verdi = tilbudstekst(tilbud);
                        return verdi.length > 0 ? (
                            <SøknadInfoFelt
                                key={index}
                                label={`Tilbud ${index + 1}`}
                                value={verdi}
                            />
                        ) : null;
                    })}
                </SøknadInfoSeksjon>
            )}
            {antallVedlegg(behandlingFakta.dokumentasjon) > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};
