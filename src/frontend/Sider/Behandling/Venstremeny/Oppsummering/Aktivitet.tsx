import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { SøknadInfoFelt, SøknadInfoSeksjon } from './Visningskomponenter';
import {
    FaktaAktivitet,
    typeAnnenAktivitetTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

export const AktivitetFelt: React.FC<{
    aktivitet: FaktaAktivitet;
    visLønnetAktivitet?: boolean;
}> = ({ aktivitet, visLønnetAktivitet = false }) => {
    const aktiviteter = aktivitet.søknadsgrunnlag?.aktiviteter;
    const annenAktivitet = aktivitet.søknadsgrunnlag?.annenAktivitet;
    const erLønnetAktivitet = aktivitet.søknadsgrunnlag?.lønnetAktivitet;
    const aktiviteterTekst = aktiviteter?.filter((aktivitet) => aktivitet !== 'Annet').join(', ');

    return (
        <>
            {aktiviteterTekst && (
                <SøknadInfoFelt
                    label="Hvilken aktivitet søker du om støtte ifm?"
                    value={aktiviteterTekst}
                />
            )}
            {annenAktivitet && (
                <SøknadInfoFelt
                    label="Hva slags type arbeidsrettet aktivitet går du på?"
                    value={`Annet: ${tekstEllerKode(typeAnnenAktivitetTilTekst, annenAktivitet)}`}
                />
            )}
            {visLønnetAktivitet && erLønnetAktivitet && (
                <SøknadInfoFelt
                    label="Mottar du lønn gjennom et tiltak?"
                    value={jaNeiTilTekst[erLønnetAktivitet]}
                />
            )}
        </>
    );
};

export const Aktivitet: React.FC<{ aktivitet: FaktaAktivitet }> = ({ aktivitet }) => {
    if (aktivitet.søknadsgrunnlag === null) {
        return null;
    }

    return (
        <SøknadInfoSeksjon label="Arbeidsrettet aktivitet" ikon={<BriefcaseIcon />}>
            <AktivitetFelt aktivitet={aktivitet} visLønnetAktivitet />
        </SøknadInfoSeksjon>
    );
};
