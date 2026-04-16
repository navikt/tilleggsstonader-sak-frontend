import React from 'react';

import { BriefcaseIcon, WheelchairIcon } from '@navikt/aksel-icons';

import { InfoSeksjon, OppsummeringFelt } from './Visningskomponenter';
import {
    annenUtdanningTypeTilTekst,
    FaktaUtdanning,
} from '../../../../typer/behandling/behandlingFakta/faktaUtdanning';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

export function harUtdanningsopplysninger(faktaUtdanning: FaktaUtdanning): boolean {
    const søknadsgrunnlag = faktaUtdanning.søknadsgrunnlag;

    return Boolean(
        søknadsgrunnlag?.aktiviteter?.length ||
        søknadsgrunnlag?.annenUtdanning ||
        søknadsgrunnlag?.harRettTilUtstyrsstipend?.erLærlingEllerLiknende !== undefined ||
        søknadsgrunnlag?.harRettTilUtstyrsstipend?.harTidligereFullførtVgs !== undefined ||
        søknadsgrunnlag?.harFunksjonsnedsettelse !== undefined
    );
}

const Utdanning: React.FC<{ faktaUtdanning: FaktaUtdanning }> = ({ faktaUtdanning }) => {
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
                harTidligereFullførtVgs) && (
                <InfoSeksjon label="Arbeidsrettet aktivitet" ikon={<BriefcaseIcon />}>
                    {aktiviteterTekst && (
                        <OppsummeringFelt
                            label="Hvilken aktivitet søker du om støtte ifm?"
                            value={aktiviteterTekst}
                        />
                    )}
                    {annenUtdanning && (
                        <OppsummeringFelt
                            label="Hva slags type arbeidsrettet aktivitet går du på?"
                            value={`Annet: ${tekstEllerKode(annenUtdanningTypeTilTekst, annenUtdanning)}`}
                        />
                    )}
                    {erLærlingEllerLiknende && (
                        <OppsummeringFelt
                            label="Er du lærling, lærekandidat, praksisbrevkandidat eller kandidat for fagbrev på jobb?"
                            value={jaNeiTilTekst[erLærlingEllerLiknende]}
                        />
                    )}
                    {harTidligereFullførtVgs && (
                        <OppsummeringFelt
                            label="Har du tidligere fullført videregående opplæring?"
                            value={jaNeiTilTekst[harTidligereFullførtVgs]}
                        />
                    )}
                </InfoSeksjon>
            )}
            {harFunksjonsnedsettelse && (
                <InfoSeksjon label="Særlig store utgifter" ikon={<WheelchairIcon />}>
                    <OppsummeringFelt
                        label="Har du funksjonsnedsettelse som gir særlig store utgifter?"
                        value={jaNeiTilTekst[harFunksjonsnedsettelse]}
                    />
                </InfoSeksjon>
            )}
        </>
    );
};

export default Utdanning;
