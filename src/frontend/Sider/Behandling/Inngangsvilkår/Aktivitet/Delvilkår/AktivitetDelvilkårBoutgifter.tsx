import React from 'react';

import styled from 'styled-components';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormBoutgifter } from '../EndreAktivitetBoutgifter';
import { skalVurdereLønnet } from '../utilsBoutgifter';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårBoutgfiter: React.FC<{
    aktivitetForm: EndreAktivitetFormBoutgifter;
    oppdaterLønnet: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereLønnet(aktivitetForm.type)) return null;

    return (
        <Container>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
        </Container>
    );
};
