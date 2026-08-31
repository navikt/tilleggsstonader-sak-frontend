import React from 'react';

import { Detail } from '@navikt/ds-react';

import {
    Aktivitet,
    erAktivitetBoutgifter,
    erAktivitetDagligReiseTso,
    erAktivitetDagligReiseTsr,
    erAktivitetLæremidler,
    erAktivitetPassAvBarn,
    erAktivitetReiseTilSamlingTso,
    erAktivitetReiseTilSamlingTsr,
} from '../../typer/vilkårperiode/aktivitet';
import { AktivitetBoutgifter } from '../../typer/vilkårperiode/aktivitetBoutgifter';
import { AktivitetDagligReiseTso } from '../../typer/vilkårperiode/aktivitetDagligReiseTso';
import { AktivitetDagligReiseTsr } from '../../typer/vilkårperiode/aktivitetDagligReiseTsr';
import {
    AktivitetLæremidler,
    studienivåTilTekst,
} from '../../typer/vilkårperiode/aktivitetLæremidler';
import { AktivitetPassAvBarn } from '../../typer/vilkårperiode/aktivitetPassAvBarn';
import { AktivitetReiseTilSamlingTso } from '../../typer/vilkårperiode/aktivitetReiseTilSamlingTso';
import { AktivitetReiseTilSamlingTsr } from '../../typer/vilkårperiode/aktivitetReiseTilSamlingTsr';
import {
    erObligatoriskSvarTilTekst,
    harRettTilUtstyrsstipendSvarTilTekst,
    harUtgifterSvarTilTekst,
    lønnetSvarTilTekst,
} from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

export const FaktaOgDelvilkårVisning: React.FC<{
    aktivitet: Aktivitet;
}> = ({ aktivitet }) => {
    if (erAktivitetPassAvBarn(aktivitet)) {
        return <FaktaOgDelvilkårPassAvBarn aktivitet={aktivitet} />;
    }
    if (erAktivitetLæremidler(aktivitet)) {
        return <FaktaOgDelvilkårLæremidler aktivitet={aktivitet} />;
    }
    if (erAktivitetBoutgifter(aktivitet)) {
        return <FaktaOgDelvilkårBoutgifter aktivitet={aktivitet} />;
    }
    if (erAktivitetDagligReiseTso(aktivitet)) {
        return <FaktaOgDelvilkårDagligReiseTso aktivitet={aktivitet} />;
    }
    if (erAktivitetDagligReiseTsr(aktivitet)) {
        return <FaktaOgDelvilkårDagligReiseTsr aktivitet={aktivitet} />;
    }
    if (erAktivitetReiseTilSamlingTso(aktivitet)) {
        return <FaktaOgDelvilkårReiseTilSamlingTso aktivitet={aktivitet} />;
    }
    if (erAktivitetReiseTilSamlingTsr(aktivitet)) {
        return <FaktaOgDelvilkårReiseTilSamlingTsr aktivitet={aktivitet} />;
    }
    return null;
};

const FaktaOgDelvilkårPassAvBarn: React.FC<{
    aktivitet: AktivitetPassAvBarn;
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
    const aktivitetsdager = aktivitet.faktaOgVurderinger.aktivitetsdager;

    return (
        <>
            {svarLønnet && <Detail>{lønnetSvarTilTekst[svarLønnet]}</Detail>}
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
            {aktivitetsdager && <Detail>{`${aktivitetsdager} dager/uke`}</Detail>}
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

const FaktaOgDelvilkårReiseTilSamlingTso: React.FC<{
    aktivitet: AktivitetReiseTilSamlingTso;
}> = ({ aktivitet }) => {
    const svarLønnet = aktivitet.faktaOgVurderinger.lønnet?.svar;
    const svarHarUtgifter = aktivitet.faktaOgVurderinger.harUtgifter?.svar;
    const svarErObligatorisk = aktivitet.faktaOgVurderinger.erAktivitetenObligatorisk?.svar;

    return (
        <>
            {svarLønnet && <Detail>{lønnetSvarTilTekst[svarLønnet]}</Detail>}
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
            {svarErObligatorisk && (
                <Detail>{erObligatoriskSvarTilTekst[svarErObligatorisk]}</Detail>
            )}
        </>
    );
};

const FaktaOgDelvilkårReiseTilSamlingTsr: React.FC<{
    aktivitet: AktivitetReiseTilSamlingTsr;
}> = ({ aktivitet }) => {
    const svarLønnet = aktivitet.faktaOgVurderinger.lønnet?.svar;
    const svarHarUtgifter = aktivitet.faktaOgVurderinger.harUtgifter?.svar;
    const svarErObligatorisk = aktivitet.faktaOgVurderinger.erAktivitetenObligatorisk?.svar;
    const aktivitetsdager = aktivitet.faktaOgVurderinger.aktivitetsdager;

    return (
        <>
            {svarLønnet && <Detail>{lønnetSvarTilTekst[svarLønnet]}</Detail>}
            {svarHarUtgifter && <Detail>{harUtgifterSvarTilTekst[svarHarUtgifter]}</Detail>}
            {svarErObligatorisk && (
                <Detail>{erObligatoriskSvarTilTekst[svarErObligatorisk]}</Detail>
            )}
            {aktivitetsdager && <Detail>{`${aktivitetsdager} dager/uke`}</Detail>}
        </>
    );
};
