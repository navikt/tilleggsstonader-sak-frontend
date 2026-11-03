import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';

import { AdresseFelt } from './AdresseFelt';
import { Avreiseadresse } from './Avreiseadresse';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoFelt, SøknadInfoSeksjon, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaFlytting } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    flytteårsakTilTekst,
    flyttemåteTilTekst,
    utgifterDekketPåAnnenMåteTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaFlytting';
import { formaterDato } from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

function formaterKroner(beløp?: number) {
    return beløp !== undefined && beløp !== null
        ? `${formaterTallMedTusenSkille(beløp)} kr`
        : undefined;
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
                        label="Hvorfor flytter du?"
                        value={flytteårsakTilTekst[detaljer.årsak]}
                    />
                    <SøknadInfoFelt
                        label="Dato for flytting"
                        value={formaterDato(detaljer.flyttedato)}
                    />
                    <Avreiseadresse
                        adresse={detaljer.adresseDetSkalFlyttesFra}
                        skalReiseFraFolkeregistrertAdresse={
                            detaljer.skalFlytteFraFolkeregistrertAdresse
                        }
                        spørsmål="Flytter du fra din folkeregistrerte adresse?"
                        adresseLabel="Adresse det skal flyttes fra"
                        folkeregistrertAdresseLabel="Folkeregistrert adresse"
                    />
                    <AdresseFelt label="Ny adresse" {...detaljer.adresse} />
                    <SøknadInfoFelt
                        label="Flytter du selv eller benytter du deg av flyttebyrå?"
                        value={flyttemåteTilTekst[detaljer.flyttemåte]}
                    />
                    <SøknadInfoFelt
                        label="Får du dekket utgiftene dine til flytting på en annen måte enn med stønad fra Nav?"
                        value={
                            utgifterDekketPåAnnenMåteTilTekst[detaljer.utgifterDekketPåAnnenMåte]
                        }
                    />
                    <SøknadInfoFelt
                        label="Hvor lang reisevei har du?"
                        value={
                            utgifter
                                ? `${formaterTallMedTusenSkille(utgifter.avstand)} km`
                                : undefined
                        }
                    />
                    <SøknadInfoFelt
                        label="Leie av henger"
                        value={formaterKroner(utgifter?.hengerleie)}
                    />
                    <SøknadInfoFelt label="Leie av bil" value={formaterKroner(utgifter?.leiebil)} />
                    <SøknadInfoFelt label="Bom" value={formaterKroner(utgifter?.bom)} />
                    <SøknadInfoFelt label="Parkering" value={formaterKroner(utgifter?.parkering)} />
                    <SøknadInfoFelt label="Ferje" value={formaterKroner(utgifter?.ferje)} />
                    <SøknadInfoFelt
                        label="Andre utgifter"
                        value={formaterKroner(utgifter?.annet)}
                    />
                    {detaljer.flyttetilbud?.map((tilbud, index) => (
                        <React.Fragment key={index}>
                            <SøknadInfoFelt
                                label={`Navn på flyttebyrå ${index + 1}`}
                                value={tilbud.navn}
                                copyText={tilbud.navn}
                            />
                            <SøknadInfoFelt
                                label={`Beløp for flyttebyrå ${index + 1}`}
                                value={formaterKroner(tilbud.beløp)}
                                copyText={String(tilbud.beløp)}
                            />
                        </React.Fragment>
                    ))}
                </SøknadInfoSeksjon>
            )}
            {antallVedlegg(behandlingFakta.dokumentasjon) > 0 && (
                <Vedlegg fakta={behandlingFakta.dokumentasjon} />
            )}
        </>
    );
};
