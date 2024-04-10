import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { Informasjonskilde, Informasjonsrad } from './Visningskomponenter';
import {
    FaktaArbeidOgOpphold,
    FaktaOppholdUtenforNorge,
    typePengestøtteTilTekst,
    årsakOppholdUtenforNorgeTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoDato } from '../../../../utils/dato';

const OppholdUtenforNorge: React.FC<{ opphold: FaktaOppholdUtenforNorge }> = ({ opphold }) => {
    return (
        <Informasjonsrad
            kilde={Informasjonskilde.SØKNAD}
            verdi={
                <VStack>
                    <BodyShort size="small">{opphold.land}</BodyShort>
                    <BodyShort size="small">
                        {opphold.årsak
                            .map((årsak) => årsakOppholdUtenforNorgeTilTekst[årsak])
                            .join(', ')}
                    </BodyShort>
                    <BodyShort size="small">
                        {formaterIsoDato(opphold.fom)} - {formaterIsoDato(opphold.tom)}
                    </BodyShort>
                </VStack>
            }
        />
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
        <VStack gap={'2'}>
            <Label size="small">{tittel}</Label>
            {spørsmål === JaNei.NEI && (
                <Informasjonsrad kilde={Informasjonskilde.SØKNAD} verdi={jaNeiTilTekst[spørsmål]} />
            )}
            {faktaOpphold.map((opphold, indeks) => (
                <OppholdUtenforNorge key={indeks} opphold={opphold} />
            ))}
        </VStack>
    );
};

const ArbeidOgOpphold: React.FC<{ fakta: FaktaArbeidOgOpphold }> = ({ fakta }) => {
    return (
        <>
            {fakta.jobberIAnnetLand === JaNei.NEI && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={`Jobber i annet land: ${jaNeiTilTekst[fakta.jobberIAnnetLand]}`}
                />
            )}
            {fakta.jobbAnnetLand && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={`Jobber i: ${fakta.jobbAnnetLand}`}
                />
            )}

            {fakta.harPengestøtteAnnetLand && (
                <div>
                    <Label size={'small'}>Pengestøtte fra annet land</Label>
                    <Informasjonsrad
                        kilde={Informasjonskilde.SØKNAD}
                        verdi={
                            <VStack gap={'2'}>
                                {fakta.pengestøtteAnnetLand && (
                                    <BodyShort size="small">{fakta.pengestøtteAnnetLand}</BodyShort>
                                )}
                                <BodyShort size="small">
                                    {fakta.harPengestøtteAnnetLand
                                        .map((pengestøtte) => typePengestøtteTilTekst[pengestøtte])
                                        .join(', ')}
                                </BodyShort>
                            </VStack>
                        }
                    />
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
        </>
    );
};

export default ArbeidOgOpphold;
