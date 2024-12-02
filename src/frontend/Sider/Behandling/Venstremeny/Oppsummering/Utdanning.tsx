import React from 'react';

import { BriefcaseIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

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
    const harTidligereFullførtVgs = faktaUtdanning.søknadsgrunnlag?.harTidligereFullførtVgs;
    const harFunksjonsnedsettelse = faktaUtdanning.søknadsgrunnlag?.harFunksjonsnedsettelse;
    return (
        <>
            {(aktiviteter || annenUtdanning) && (
                <InfoSeksjon label="Aktivitet" ikon={<BriefcaseIcon />}>
                    <VStack gap={'4'}>
                        {aktiviteter && (
                            <BodyShort size="small">
                                {aktiviteter?.map((aktivitet) => aktivitet)?.join(', ')}
                            </BodyShort>
                        )}
                        {annenUtdanning && (
                            <>
                                <BodyShort size="small">
                                    {`Annet: ${tekstEllerKode(annenUtdanningTypeTilTekst, annenUtdanning)}`}
                                </BodyShort>
                                {erLærlingEllerLiknende && (
                                    <BodyShort size="small">
                                        {`Lærling, lærekandidat, praksisbrevkandidat, kandidat for fagbrev på jobb?: 
                            ${jaNeiTilTekst[erLærlingEllerLiknende]}`}
                                    </BodyShort>
                                )}
                                {harTidligereFullførtVgs && (
                                    <BodyShort size="small">
                                        {`Fullført VGS: ${jaNeiTilTekst[harTidligereFullførtVgs]}`}
                                    </BodyShort>
                                )}
                            </>
                        )}
                    </VStack>
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
