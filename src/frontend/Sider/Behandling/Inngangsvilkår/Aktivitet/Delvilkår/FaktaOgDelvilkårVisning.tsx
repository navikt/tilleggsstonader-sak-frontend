import React from 'react';

import { Detail } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';
import { AktivitetBarnetilsyn } from '../../typer/vilkårperiode/aktivitetBarnetilsyn';
import { AktivitetBoutgifter } from '../../typer/vilkårperiode/aktivitetBoutgifter';
import { AktivitetDagligReiseTso } from '../../typer/vilkårperiode/aktivitetDagligReiseTso';
import { AktivitetDagligReiseTsr } from '../../typer/vilkårperiode/aktivitetDagligReiseTsr';
import {
    AktivitetLæremidler,
    studienivåTilTekst,
} from '../../typer/vilkårperiode/aktivitetLæremidler';
import {
    harRettTilUtstyrsstipendSvarTilTekst,
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
        case Stønadstype.BOUTGIFTER:
            return <FaktaOgDelvilkårBoutgifter aktivitet={aktivitet as AktivitetBoutgifter} />;
        case Stønadstype.DAGLIG_REISE_TSO:
            return (
                <FaktaOgDelvilkårDagligReiseTso aktivitet={aktivitet as AktivitetDagligReiseTso} />
            );
        case Stønadstype.DAGLIG_REISE_TSR:
            return (
                <FaktaOgDelvilkårDagligReiseTsr aktivitet={aktivitet as AktivitetDagligReiseTsr} />
            );
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
    const studienivå = aktivitet.faktaOgVurderinger.studienivå;
    const svarHarUtgifter = aktivitet.faktaOgVurderinger.harUtgifter?.svar;
    const svarHarRettTilUtstyrsstipend =
        aktivitet.faktaOgVurderinger.harRettTilUtstyrsstipend?.svar;

    return (
        <>
            <Detail>
                {aktivitet.faktaOgVurderinger.prosent
                    ? `${aktivitet.faktaOgVurderinger.prosent}%`
                    : ''}
            </Detail>
            {studienivå && <Detail>{studienivåTilTekst[studienivå]}</Detail>}
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
            {svarHarRettTilUtstyrsstipend && (
                <Detail>
                    {harRettTilUtstyrsstipendSvarTilTekst[svarHarRettTilUtstyrsstipend]}
                </Detail>
            )}
        </>
    );
};

const FaktaOgDelvilkårBoutgifter: React.FC<{
    aktivitet: AktivitetBoutgifter;
}> = ({ aktivitet }) => {
    const svarLønnet = aktivitet.faktaOgVurderinger.lønnet?.svar;

    return svarLønnet && <Detail>{lønnetSvarTilTekst[svarLønnet]}</Detail>;
};

const FaktaOgDelvilkårDagligReiseTso: React.FC<{
    aktivitet: AktivitetDagligReiseTso;
}> = ({ aktivitet }) => {
    const svarLønnet = aktivitet.faktaOgVurderinger.lønnet?.svar;
    const svarHarUtgifter = aktivitet.faktaOgVurderinger.harUtgifter?.svar;

    return (
        <>
            {svarLønnet && <Detail>{lønnetSvarTilTekst[svarLønnet]}</Detail>}
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
        </>
    );
};

const FaktaOgDelvilkårDagligReiseTsr: React.FC<{
    aktivitet: AktivitetDagligReiseTsr;
}> = ({ aktivitet }) => {
    const svarHarUtgifter = aktivitet.faktaOgVurderinger.harUtgifter?.svar;
    const aktivitetsdager = aktivitet.faktaOgVurderinger.aktivitetsdager;

    return (
        <>
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
            {aktivitetsdager && <Detail>{`${aktivitetsdager} dager/uke`}</Detail>}
        </>
    );
};
