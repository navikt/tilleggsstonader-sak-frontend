import React from 'react';

import styled from 'styled-components';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormLæremidler } from '../EndreAktivitetLæremidler';
import { skalVurdereHarUtgifter } from '../utilsLæremidler';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårLæremidler: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterHarUtgifter: (svar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterHarUtgifter, readOnly }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereHarUtgifter(aktivitetForm.type)) return null;

    return (
        <Container>
            <JaNeiVurdering
                label="Har bruker utgifter til læremidler?"
                readOnly={readOnly}
                svar={aktivitetForm.svarHarUtgifter}
                oppdaterSvar={oppdaterHarUtgifter}
            />
        </Container>
    );
};
