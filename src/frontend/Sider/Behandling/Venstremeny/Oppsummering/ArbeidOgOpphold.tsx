import React from 'react';

import { GlobeIcon } from '@navikt/aksel-icons';
import { BodyShort, Label } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaArbeidOgOpphold,
    FaktaOppholdUtenforNorge,
    typePengestøtteTilTekst,
    årsakOppholdUtenforNorgeTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoDato } from '../../../../utils/dato';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const OppholdUtenforNorge: React.FC<{ opphold: FaktaOppholdUtenforNorge }> = ({ opphold }) => {
    return (
        <>
            <BodyShort size="small">{opphold.land}</BodyShort>
            <BodyShort size="small">
                {opphold.årsak
                    .map((årsak) => tekstEllerKode(årsakOppholdUtenforNorgeTilTekst, årsak))
                    .join(', ')}
            </BodyShort>
            <BodyShort size="small">
                {formaterIsoDato(opphold.fom)} - {formaterIsoDato(opphold.tom)}
            </BodyShort>
        </>
    );
};

const OppholdUtenforNorge12mnd: React.FC<{
    tittel: string;
    spørsmål?: JaNei;
    faktaOpphold: FaktaOppholdUtenforNorge[];
}> = ({ tittel, spørsmål, faktaOpphold }) => {
    if (!spørsmål) {
        return null;
    }
    return (
        <div>
            <Label size="small">{tittel}</Label>
            {spørsmål === JaNei.NEI && (
                <BodyShort size="small">{jaNeiTilTekst[spørsmål]}</BodyShort>
            )}
            {faktaOpphold.map((opphold, indeks) => (
                <OppholdUtenforNorge key={indeks} opphold={opphold} />
            ))}
        </div>
    );
};

const ArbeidOgOpphold: React.FC<{ fakta: FaktaArbeidOgOpphold }> = ({ fakta }) => {
    return (
        <InfoSeksjon label={'Arbeid og opphold'} ikon={<GlobeIcon />}>
            {fakta.jobberIAnnetLand === JaNei.NEI && (
                <BodyShort size="small">
                    Jobber i annet land: {jaNeiTilTekst[fakta.jobberIAnnetLand]}
                </BodyShort>
            )}
            {fakta.jobbAnnetLand && (
                <BodyShort size="small">Jobber i: {fakta.jobbAnnetLand}</BodyShort>
            )}

            {fakta.harPengestøtteAnnetLand && (
                <div>
                    <Label size={'small'}>Pengestøtte fra annet land</Label>

                    {fakta.pengestøtteAnnetLand && (
                        <BodyShort size="small">{fakta.pengestøtteAnnetLand}</BodyShort>
                    )}
                    <BodyShort size="small">
                        {fakta.harPengestøtteAnnetLand
                            .map((pengestøtte) =>
                                tekstEllerKode(typePengestøtteTilTekst, pengestøtte)
                            )
                            .join(', ')}
                    </BodyShort>
                </div>
            )}

            <OppholdUtenforNorge12mnd
                tittel={'Opphold utenfor Norge siste 12mnd'}
                spørsmål={fakta.harOppholdUtenforNorgeSiste12mnd}
                faktaOpphold={fakta.oppholdUtenforNorgeSiste12mnd}
            />

            <OppholdUtenforNorge12mnd
                tittel={'Opphold utenfor Norge neste 12mnd'}
                spørsmål={fakta.harOppholdUtenforNorgeNeste12mnd}
                faktaOpphold={fakta.oppholdUtenforNorgeNeste12mnd}
            />
        </InfoSeksjon>
    );
};

export default ArbeidOgOpphold;
