import React from 'react';

import { Detail } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Aktivitet, AktivitetLæremidler } from '../../typer/vilkårperiode/aktivitet';
import { AktivitetBarnetilsyn } from '../../typer/vilkårperiode/aktivitetBarnetilsyn';
import {
    harUtgifterSvarTilTekst,
    lønnetSvarTilTekst,
} from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

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
    const svarLønnet = aktivitet.faktaOgVurderinger.lønnet?.svar;

    return (
        <>
            <Detail>{aktivitet.faktaOgVurderinger.aktivitetsdager} aktivitetsdager</Detail>
            {svarLønnet && <Detail>{lønnetSvarTilTekst[svarLønnet]}</Detail>}
        </>
    );
};

const FaktaOgDelvilkårLæremidler: React.FC<{
    aktivitet: AktivitetLæremidler;
}> = ({ aktivitet }) => {
    const svarHarUtgifter = aktivitet.faktaOgVurderinger.harUtgifter?.svar;

    return (
        <>
            <Detail>{aktivitet.faktaOgVurderinger.prosent}%</Detail>
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
        </>
    );
};
