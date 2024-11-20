import React from 'react';

import styled from 'styled-components';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode';
import { EndreAktivitetFormBarnetilsyn } from '../EndreAktivitetBarnetilsyn';
import { skalVurdereLønnet } from '../utilsBarnetilsyn';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårBarnetilsyn: React.FC<{
    aktivitetForm: EndreAktivitetFormBarnetilsyn;
    oppdaterLønnet: (svar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterLønnet, readOnly }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereLønnet(aktivitetForm.type)) return null;

    return (
        <Container>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                readOnly={readOnly}
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
        </Container>
    );
};
