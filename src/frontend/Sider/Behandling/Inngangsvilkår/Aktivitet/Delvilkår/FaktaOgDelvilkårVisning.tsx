import React from 'react';

import { Detail } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import {
    Aktivitet,
    AktivitetBarnetilsyn,
    AktivitetLæremidler,
    FaktaOgVurderingerBarnetilsyn,
    FaktaOgVurderingerLæremidler,
    mapTilAktivitetBarnetilsynNy,
    mapTilAktivitetLæremidlerNy,
} from '../../typer/aktivitet';
import { lønnetSvarTilTekst } from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

export const FaktaOgDelvilkårVisning: React.FC<{
    aktivitet: Aktivitet;
}> = ({ aktivitet }) => {
    const { behandling } = useBehandling();

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <FaktaOgDelvilkårTilsynBarn
                    faktaOgVurderinger={
                        mapTilAktivitetBarnetilsynNy(aktivitet as AktivitetBarnetilsyn)!
                            .faktaOgVurderinger
                    }
                />
            );
        case Stønadstype.LÆREMIDLER:
            return (
                <FaktaOgDelvilkårLæremidler
                    faktaOgVurderinger={
                        mapTilAktivitetLæremidlerNy(aktivitet as AktivitetLæremidler)!
                            .faktaOgVurderinger
                    }
                />
            );
    }
};

const FaktaOgDelvilkårTilsynBarn: React.FC<{
    faktaOgVurderinger: FaktaOgVurderingerBarnetilsyn;
}> = ({ faktaOgVurderinger }) => {
    const svarPåDelvilkår = faktaOgVurderinger.vurderinger.lønnet?.svar;

    return (
        <>
            <Detail>{faktaOgVurderinger.fakta.aktivitetsdager} aktivitetsdager</Detail>
            {svarPåDelvilkår && <Detail>{lønnetSvarTilTekst[svarPåDelvilkår]}</Detail>}
        </>
    );
};

const FaktaOgDelvilkårLæremidler: React.FC<{
    faktaOgVurderinger: FaktaOgVurderingerLæremidler;
}> = ({ faktaOgVurderinger }) => {
    const svarPåDelvilkår = faktaOgVurderinger.vurderinger.harUtgifter?.svar;

    return (
        <>
            <Detail>{faktaOgVurderinger.fakta.prosent} %</Detail>
            {svarPåDelvilkår && <Detail>{lønnetSvarTilTekst[svarPåDelvilkår]}</Detail>}
        </>
    );
};
