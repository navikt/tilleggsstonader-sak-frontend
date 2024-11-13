import React from 'react';

import { Detail } from '@navikt/ds-react';

import { DelvilkårAktivitet } from '../../typer/aktivitet';
import { lønnetSvarTilTekst } from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

export const FaktaOgDelvilkårVisning = ({
    aktivitetsdager,
    delvilkår: { lønnet },
}: {
    aktivitetsdager: number | undefined;
    delvilkår: DelvilkårAktivitet;
}) => (
    <>
        <Detail>{aktivitetsdager} aktivitetsdager</Detail>
        {lønnet?.svar && <Detail>{lønnetSvarTilTekst[lønnet.svar]}</Detail>}
    </>
);
