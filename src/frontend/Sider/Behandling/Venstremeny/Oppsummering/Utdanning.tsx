import React from 'react';

import { BriefcaseIcon, HatSchoolIcon, WheelchairIcon } from '@navikt/aksel-icons';
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
    const erLærlingEllerLiknende = faktaUtdanning.søknadsgrunnlag?.erLærlingEllerLiknende;
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
            {erLærlingEllerLiknende && (
                <InfoSeksjon label="Er lærling eller liknende" ikon={<HatSchoolIcon />}>
                    <BodyShort size="small">{jaNeiTilTekst[erLærlingEllerLiknende]}</BodyShort>
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
