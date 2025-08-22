import React from 'react';

import styled from 'styled-components';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormDagligReiseTso } from '../EndreAktivitetDagligReiseTso';
import { skalVurdereLønnet } from '../utilsDagligReiseTso';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårDagligReiseTso: React.FC<{
    aktivitetForm: EndreAktivitetFormDagligReiseTso;
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
