import React from 'react';

import { BriefcaseIcon, WheelchairIcon } from '@navikt/aksel-icons';

import { SøknadInfoFelt, SøknadInfoSeksjon } from './Visningskomponenter';
import {
    annenUtdanningTypeTilTekst,
    FaktaUtdanning,
} from '../../../../typer/behandling/behandlingFakta/faktaUtdanning';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

export const Utdanning: React.FC<{ faktaUtdanning: FaktaUtdanning }> = ({ faktaUtdanning }) => {
    const aktiviteter = faktaUtdanning.søknadsgrunnlag?.aktiviteter;
    const annenUtdanning = faktaUtdanning.søknadsgrunnlag?.annenUtdanning;
    const erLærlingEllerLiknende =
        faktaUtdanning.søknadsgrunnlag?.harRettTilUtstyrsstipend?.erLærlingEllerLiknende;
    const harTidligereFullførtVgs =
        faktaUtdanning.søknadsgrunnlag?.harRettTilUtstyrsstipend?.harTidligereFullførtVgs;
    const harFunksjonsnedsettelse = faktaUtdanning.søknadsgrunnlag?.harFunksjonsnedsettelse;
    const aktiviteterTekst = aktiviteter?.join(', ');

    return (
        <>
            {(aktiviteterTekst ||
                annenUtdanning ||
                erLærlingEllerLiknende ||
                harTidligereFullførtVgs ||
                harFunksjonsnedsettelse) && (
                <SøknadInfoSeksjon label="Arbeidsrettet aktivitet" ikon={<BriefcaseIcon />}>
                    {aktiviteterTekst && (
                        <SøknadInfoFelt
                            label="Hvilken aktivitet søker du om støtte ifm?"
                            value={aktiviteterTekst}
                        />
                    )}
                    {annenUtdanning && (
                        <SøknadInfoFelt
                            label="Hva slags type arbeidsrettet aktivitet går du på?"
                            value={`Annet: ${tekstEllerKode(annenUtdanningTypeTilTekst, annenUtdanning)}`}
                        />
                    )}
                    {erLærlingEllerLiknende && (
                        <SøknadInfoFelt
                            label="Er du lærling, lærekandidat, praksisbrevkandidat eller kandidat for fagbrev på jobb?"
                            value={jaNeiTilTekst[erLærlingEllerLiknende]}
                        />
                    )}
                    {harTidligereFullførtVgs && (
                        <SøknadInfoFelt
                            label="Har du tidligere fullført videregående opplæring?"
                            value={jaNeiTilTekst[harTidligereFullførtVgs]}
                        />
                    )}
                    {harFunksjonsnedsettelse && (
                        <SøknadInfoFelt
                            label="Har du funksjonsnedsettelse som gir særlig store utgifter?"
                            value={jaNeiTilTekst[harFunksjonsnedsettelse]}
                            ikon={<WheelchairIcon />}
                        />
                    )}
                </SøknadInfoSeksjon>
            )}
        </>
    );
};
