import React from 'react';

import styled from 'styled-components';

import { EndreAktivitetForm } from './EndreAktivitetRad';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårAktivitet } from '../typer/aktivitet';
import { Vurdering } from '../typer/vilkårperiode';
import {skalVurdereLønnet} from "./utils";

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

    return (
        <Container>
            {skalVurdereLønnet(aktivitetForm.type) && (
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
