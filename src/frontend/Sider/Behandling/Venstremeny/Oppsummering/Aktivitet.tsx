import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { InfoSeksjon, OppsummeringFelt } from './Visningskomponenter';
import {
    FaktaAktivtet,
    typeAnnenAktivitetTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

export const AktivitetFelt: React.FC<{
    aktivitet: FaktaAktivtet;
    visLønnetAktivitet?: boolean;
}> = ({ aktivitet, visLønnetAktivitet = false }) => {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;
    const aktiviteterTekst = aktiviteter?.filter((aktivitet) => aktivitet !== 'Annet').join(', ');

    return (
        <>
            {aktiviteterTekst && (
                <OppsummeringFelt
                    label="Hvilken aktivitet søker du om støtte ifm?"
                    value={aktiviteterTekst}
                />
            )}
            {annenAktivitet && (
                <OppsummeringFelt
                    label="Hva slags type arbeidsrettet aktivitet går du på?"
                    value={`Annet: ${tekstEllerKode(typeAnnenAktivitetTilTekst, annenAktivitet)}`}
                />
            )}
            {visLønnetAktivitet && erLønnetAktivitet && (
                <OppsummeringFelt
                    label="Mottar du lønn gjennom et tiltak?"
                    value={jaNeiTilTekst[erLønnetAktivitet]}
                />
            )}
        </>
    );
};

export function harAktivitetsopplysninger(
    aktivitet: FaktaAktivtet,
    visLønnetAktivitet = false
): boolean {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;
    const aktiviteterTekst = aktiviteter?.filter((aktivitet) => aktivitet !== 'Annet').join(', ');

    return Boolean(aktiviteterTekst || annenAktivitet || (visLønnetAktivitet && erLønnetAktivitet));
}

export const Aktivitet: React.FC<{ aktivitet: FaktaAktivtet }> = ({ aktivitet }) => {
    if (!harAktivitetsopplysninger(aktivitet, true)) {
        return null;
    }

    return (
        <InfoSeksjon label="Arbeidsrettet aktivitet" ikon={<BriefcaseIcon />}>
            <AktivitetFelt aktivitet={aktivitet} visLønnetAktivitet />
        </InfoSeksjon>
    );
};
