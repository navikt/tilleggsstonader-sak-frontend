import React from 'react';

import styled from 'styled-components';

import { EndreAktivitetForm } from './EndreAktivitetRad';
import { skalVurdereLønnet } from './utils';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårAktivitet } from '../typer/aktivitet';
import { Vurdering } from '../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

// TODO: Rename til AktivitetDelvilkår
const AktivitetVilkår: React.FC<{
    aktivitetForm: EndreAktivitetForm;
    oppdaterDelvilkår: (key: keyof DelvilkårAktivitet, vurdering: Vurdering) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterDelvilkår, readOnly }) => {
    if (aktivitetForm.type === '') return null;

    const visVurderingLønnet = skalVurdereLønnet(aktivitetForm.type);

    if (!visVurderingLønnet) return null;

    return (
        <Container>
            {visVurderingLønnet && (
                <JaNeiVurdering
                    label="Mottar bruker ordinær lønn i tiltaket?"
                    readOnly={readOnly}
                    vurdering={aktivitetForm.delvilkår.lønnet}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('lønnet', vurdering)
                    }
                />
            )}
        </Container>
    );
};

export default AktivitetVilkår;
