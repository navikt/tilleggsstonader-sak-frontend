import React from 'react';

import styled from 'styled-components';

import JaNeiVurdering from '../../../Vilkårvurdering/JaNeiVurdering';
import { AktivitetType, VurderingAktivitet } from '../../typer/aktivitet';
import { Vurdering } from '../../typer/vilkårperiode';
import { skalVurdereHarUtgifter } from '../utilsLæremidler';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårFelles = <K extends keyof VurderingAktivitet>({
    vurdering,
    type,
    label,
    oppdaterDelvilkår,
    vurderingKey,
    readOnly,
}: {
    vurdering: Vurdering;
    type: AktivitetType | '';
    label: string;
    oppdaterDelvilkår: (key: K, vurdering: Vurdering) => void;
    vurderingKey: K;
    readOnly: boolean;
}) => {
    if (type === '') return null;

    if (!skalVurdereHarUtgifter(type)) return null;

    return (
        <Container>
            <JaNeiVurdering
                label={label}
                readOnly={readOnly}
                vurdering={vurdering}
                oppdaterVurdering={(vurdering: Vurdering) =>
                    oppdaterDelvilkår(vurderingKey, vurdering)
                }
            />
        </Container>
    );
};
