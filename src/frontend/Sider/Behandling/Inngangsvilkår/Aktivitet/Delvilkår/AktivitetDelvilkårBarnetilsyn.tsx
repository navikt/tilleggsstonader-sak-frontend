import React from 'react';

import styled from 'styled-components';

import JaNeiVurdering from '../../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårAktivitetBarnetilsyn } from '../../typer/aktivitet';
import { Vurdering } from '../../typer/vilkårperiode';
import { EndreAktivitetFormBarnetilsyn } from '../EndreAktivitetBarnetilsyn';
import { skalVurdereLønnet } from '../utilsBarnetilsyn';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårBarnetilsyn: React.FC<{
    aktivitetForm: EndreAktivitetFormBarnetilsyn;
    oppdaterDelvilkår: (key: keyof DelvilkårAktivitetBarnetilsyn, vurdering: Vurdering) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterDelvilkår, readOnly }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereLønnet(aktivitetForm.type)) return null;

    return (
        <Container>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                readOnly={readOnly}
                vurdering={aktivitetForm.delvilkår.lønnet}
                oppdaterVurdering={(vurdering: Vurdering) => oppdaterDelvilkår('lønnet', vurdering)}
            />
        </Container>
    );
};
