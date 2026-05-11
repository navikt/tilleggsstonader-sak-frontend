import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { SøknadInfoFelt } from './Visningskomponenter';
import {
    FaktaArbeidOgOpphold,
    FaktaOppholdUtenforNorge,
    typePengestøtteTilTekst,
    årsakOppholdUtenforNorgeTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoDato } from '../../../../utils/dato';
import { tekstMedFallback, toTitleCase } from '../../../../utils/tekstformatering';

const OppholdUtenforNorge: React.FC<{ opphold: FaktaOppholdUtenforNorge }> = ({ opphold }) => {
    return (
        <>
            <BodyShort size="small">{toTitleCase(opphold.land)}</BodyShort>
            <BodyShort size="small">
                {opphold.årsak
                    .map((årsak) => tekstMedFallback(årsakOppholdUtenforNorgeTilTekst, årsak))
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

    if (spørsmål === JaNei.NEI) {
        return <SøknadInfoFelt label={tittel} value={tekstMedFallback(jaNeiTilTekst, spørsmål)} />;
    }

    return (
        <SøknadInfoFelt
            label={tittel}
            value={
                <VStack gap="space-8">
                    {faktaOpphold.map((opphold, indeks) => (
                        <OppholdUtenforNorge key={indeks} opphold={opphold} />
                    ))}
                </VStack>
            }
        />
    );
};

export const ArbeidOgOppholdFelt: React.FC<{
    fakta: FaktaArbeidOgOpphold;
}> = ({ fakta }) => {
    return (
        <>
            {fakta.jobberIAnnetLand === JaNei.NEI && (
                <SøknadInfoFelt
                    label="Jobber i annet land"
                    value={tekstMedFallback(jaNeiTilTekst, fakta.jobberIAnnetLand)}
                />
            )}
            {fakta.jobbAnnetLand && (
                <SøknadInfoFelt label="Jobber i" value={toTitleCase(fakta.jobbAnnetLand)} />
            )}

            {fakta.harPengestøtteAnnetLand && (
                <SøknadInfoFelt
                    label="Pengestøtte fra annet land"
                    value={
                        <VStack gap="space-4">
                            {fakta.pengestøtteAnnetLand && (
                                <BodyShort size="small">
                                    {toTitleCase(fakta.pengestøtteAnnetLand)}
                                </BodyShort>
                            )}
                            <BodyShort size="small">
                                {fakta.harPengestøtteAnnetLand
                                    .map((pengestøtte) =>
                                        tekstMedFallback(typePengestøtteTilTekst, pengestøtte)
                                    )
                                    .join(', ')}
                            </BodyShort>
                        </VStack>
                    }
                />
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
