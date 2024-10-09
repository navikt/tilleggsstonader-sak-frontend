import React from 'react';

import { BankNoteIcon, BriefcaseIcon, HatSchoolIcon, WheelchairIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    annenUtdanningTypeTilTekst,
    FaktaUtdanning,
} from '../../../../typer/behandling/behandlingFakta/faktaUtdanning';
import { svarJaNeiMapping, tekstEllerKode } from '../../../../utils/tekstformatering';

const Utdanning: React.FC<{ faktaUtdanning: FaktaUtdanning }> = ({ faktaUtdanning }) => {
    return (
        <>
            <InfoSeksjon label="Aktivitet" ikon={<BriefcaseIcon />}>
                <BodyShort size="small">
                    {faktaUtdanning.søknadsgrunnlag?.aktiviteter
                        ?.map((valgtAktivitet) => valgtAktivitet.label)
                        ?.join(', ')}
                </BodyShort>
            </InfoSeksjon>
            <InfoSeksjon label="Type utdanning" ikon={<HatSchoolIcon />}>
                <BodyShort size="small">
                    {tekstEllerKode(
                        annenUtdanningTypeTilTekst,
                        faktaUtdanning.søknadsgrunnlag?.annenUtdanning
                    )}
                </BodyShort>
            </InfoSeksjon>
            {faktaUtdanning.søknadsgrunnlag?.mottarUtstyrsstipend && (
                <InfoSeksjon label="Utstyrstipend" ikon={<BankNoteIcon />}>
                    <BodyShort size="small">
                        {svarJaNeiMapping[faktaUtdanning.søknadsgrunnlag?.mottarUtstyrsstipend]}
                    </BodyShort>
                </InfoSeksjon>
            )}
            {faktaUtdanning.søknadsgrunnlag?.harFunksjonsnedsettelse && (
                <InfoSeksjon label="Funksjonsnedsettelse" ikon={<WheelchairIcon />}>
                    <BodyShort size="small">
                        {svarJaNeiMapping[faktaUtdanning.søknadsgrunnlag?.harFunksjonsnedsettelse]}
                    </BodyShort>
                </InfoSeksjon>
            )}
        </>
    );
};

export default Utdanning;
