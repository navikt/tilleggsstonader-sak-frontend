import React from 'react';

import { EndreAktivitetForm } from './EndreAktivitetRad';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
import { Vurdering } from '../typer/vilkårperiode';

const AktivitetVilkår: React.FC<{
    aktivitetForm: EndreAktivitetForm;
    oppdaterDelvilkår: (key: keyof DelvilkårAktivitet, vurdering: Vurdering) => void;
}> = ({ aktivitetForm, oppdaterDelvilkår }) => {
    const skalVurdereLønnet = aktivitetForm.type === AktivitetType.TILTAK;

    return (
        <>
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
        </>
    );
};

export default AktivitetVilkår;
