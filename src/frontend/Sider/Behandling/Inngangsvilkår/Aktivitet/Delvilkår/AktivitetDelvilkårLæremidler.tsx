import React from 'react';

import styled from 'styled-components';

import { JaNeiDelvilkårVurdering } from '../../../Vilkårvurdering/JaNeiDelvilkårVurdering';
import { DelvilkårAktivitetLæremidler } from '../../typer/aktivitet';
import { Vurdering } from '../../typer/vilkårperiode';
import { EndreAktivitetFormLæremidler } from '../EndreAktivitetLæremidler';
import { skalVurdereHarUtgifter } from '../utilsLæremidler';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårLæremidler: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterDelvilkår: (key: keyof DelvilkårAktivitetLæremidler, vurdering: Vurdering) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterDelvilkår, readOnly }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereHarUtgifter(aktivitetForm.type)) return null;

    return (
        <Container>
            <JaNeiDelvilkårVurdering
                label="Har bruker utgifter til læremidler?"
                readOnly={readOnly}
                vurdering={aktivitetForm.delvilkår.harUtgifter}
                oppdaterVurdering={(vurdering: Vurdering) =>
                    oppdaterDelvilkår('harUtgifter', vurdering)
                }
            />
        </Container>
    );
};
