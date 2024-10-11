import React from 'react';

import { BankNoteIcon, BriefcaseIcon, HatSchoolIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    annenUtdanningTypeTilTekst,
    FaktaUtdanning,
} from '../../../../typer/behandling/behandlingFakta/faktaUtdanning';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const Utdanning: React.FC<{ faktaUtdanning: FaktaUtdanning }> = ({ faktaUtdanning }) => {
    const aktiviteter = faktaUtdanning.søknadsgrunnlag?.aktiviteter;
    const annenUtdanning = faktaUtdanning.søknadsgrunnlag?.annenUtdanning;
    const mottarUtstyrsstipend = faktaUtdanning.søknadsgrunnlag?.mottarUtstyrsstipend;
    const harFunksjonsnedsettelse = faktaUtdanning.søknadsgrunnlag?.harFunksjonsnedsettelse;
    return (
        <>
            {aktiviteter && (
                <InfoSeksjon label="Aktivitet" ikon={<BriefcaseIcon />}>
                    <BodyShort size="small">
                        {aktiviteter?.map((aktivitet) => aktivitet)?.join(', ')}
                    </BodyShort>
                </InfoSeksjon>
            )}
            {annenUtdanning && (
                <InfoSeksjon label="Type utdanning" ikon={<HatSchoolIcon />}>
                    <BodyShort size="small">
                        {tekstEllerKode(annenUtdanningTypeTilTekst, annenUtdanning)}
                    </BodyShort>
                </InfoSeksjon>
            )}
            {mottarUtstyrsstipend && (
                <InfoSeksjon label="Utstyrstipend" ikon={<BankNoteIcon />}>
                    <BodyShort size="small">{jaNeiTilTekst[mottarUtstyrsstipend]}</BodyShort>
                </InfoSeksjon>
            )}
            {harFunksjonsnedsettelse && (
                <InfoSeksjon label="Funksjonsnedsettelse" ikon={<WheelchairIcon />}>
                    <BodyShort size="small">{jaNeiTilTekst[harFunksjonsnedsettelse]}</BodyShort>
                </InfoSeksjon>
            )}
        </>
    );
};

export default Utdanning;
