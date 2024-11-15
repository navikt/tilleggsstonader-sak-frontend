import React from 'react';

import { Detail } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Aktivitet, AktivitetBarnetilsyn, AktivitetLæremidler } from '../../typer/aktivitet';
import { lønnetSvarTilTekst } from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

export const FaktaOgDelvilkårVisning: React.FC<{
    aktivitet: Aktivitet;
}> = ({ aktivitet }) => {
    const { behandling } = useBehandling();

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return <FaktaOgDelvilkårTilsynBarn aktivitet={aktivitet as AktivitetBarnetilsyn} />;
        case Stønadstype.LÆREMIDLER:
            return <FaktaOgDelvilkårLæremidler aktivitet={aktivitet as AktivitetLæremidler} />;
    }
};

const FaktaOgDelvilkårTilsynBarn: React.FC<{
    aktivitet: AktivitetBarnetilsyn;
}> = ({ aktivitet }) => {
    const svarPåDelvilkår = aktivitet.delvilkår.lønnet?.svar;

    return (
        <>
            <Detail>{aktivitet.aktivitetsdager} aktivitetsdager</Detail>
            {svarPåDelvilkår && <Detail>{lønnetSvarTilTekst[svarPåDelvilkår]}</Detail>}
        </>
    );
};

const FaktaOgDelvilkårLæremidler: React.FC<{
    aktivitet: AktivitetLæremidler;
}> = ({ aktivitet }) => {
    const svarPåDelvilkår = aktivitet.delvilkår.harUtgifter?.svar;

    return (
        <>
            <Detail>{aktivitet.prosent} %</Detail>
            {svarPåDelvilkår && <Detail>{lønnetSvarTilTekst[svarPåDelvilkår]}</Detail>}
        </>
    );
};
