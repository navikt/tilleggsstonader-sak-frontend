import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { OppsummeringFelt } from './Visningskomponenter';
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

    if (spørsmål === JaNei.NEI) {
        return <OppsummeringFelt label={tittel} value={jaNeiTilTekst[spørsmål]} />;
    }

    return (
        <OppsummeringFelt
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

export function harArbeidOgOppholdOpplysninger(fakta?: FaktaArbeidOgOpphold): boolean {
    if (!fakta) {
        return false;
    }

    return Boolean(
        fakta.jobberIAnnetLand === JaNei.NEI ||
        fakta.jobbAnnetLand ||
        fakta.harPengestøtteAnnetLand?.length ||
        fakta.harOppholdUtenforNorgeSiste12mnd ||
        fakta.harOppholdUtenforNorgeNeste12mnd
    );
}

export const ArbeidOgOppholdFelt: React.FC<{
    fakta: FaktaArbeidOgOpphold;
}> = ({ fakta }) => {
    return (
        <>
            {fakta.jobberIAnnetLand === JaNei.NEI && (
                <OppsummeringFelt
                    label="Jobber i annet land"
                    value={jaNeiTilTekst[fakta.jobberIAnnetLand]}
                />
            )}
            {fakta.jobbAnnetLand && (
                <OppsummeringFelt label="Jobber i" value={fakta.jobbAnnetLand} />
            )}

            {fakta.harPengestøtteAnnetLand && (
                <OppsummeringFelt
                    label="Pengestøtte fra annet land"
                    value={
                        <VStack gap="space-4">
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
