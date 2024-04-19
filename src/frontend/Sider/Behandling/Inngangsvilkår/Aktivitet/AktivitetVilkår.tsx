import React from 'react';

import styled from 'styled-components';

import { EndreAktivitetForm } from './EndreAktivitetRad';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
import { Vurdering } from '../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

// TODO: Rename til AktivitetDelvilkår
const AktivitetVilkår: React.FC<{
    aktivitetForm: EndreAktivitetForm;
    oppdaterDelvilkår: (key: keyof DelvilkårAktivitet, vurdering: Vurdering) => void;
}> = ({ aktivitetForm, oppdaterDelvilkår }) => {
    if (aktivitetForm.type === '') return null;

    const skalVurdereLønnet = aktivitetForm.type === AktivitetType.TILTAK;

    return (
        <Container>
            {skalVurdereLønnet && (
                <JaNeiVurdering
                    label="Lønnet"
                    vurdering={aktivitetForm.delvilkår.lønnet}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('lønnet', vurdering)
                    }
                />
            )}
            <JaNeiVurdering
                label="Sykepenger"
                vurdering={aktivitetForm.delvilkår.mottarSykepenger}
                oppdaterVurdering={(vurdering: Vurdering) =>
                    oppdaterDelvilkår('mottarSykepenger', vurdering)
                }
            />
        </Container>
    );
};

export default AktivitetVilkår;
