import React from 'react';

import { EndreAktivitetForm } from './EndreAktivitetRad';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
import { Vurdering } from '../typer/vilkårperiode';

const AktivitetVilkår: React.FC<{
    aktivitetForm: EndreAktivitetForm;
    oppdaterDelvilkår: (key: keyof DelvilkårAktivitet, vurdering: Vurdering) => void;
}> = ({ aktivitetForm, oppdaterDelvilkår }) => {
    switch (aktivitetForm.type) {
        case '':
        case AktivitetType.UTDANNING:
        case AktivitetType.REEL_ARBEIDSSØKER:
            return (
                <JaNeiVurdering
                    label="Sykepenger"
                    vurdering={aktivitetForm.delvilkår.mottarSykepenger}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('mottarSykepenger', vurdering)
                    }
                />
            );

        case AktivitetType.TILTAK:
            return (
                <>
                    <JaNeiVurdering
                        label="Lønnet"
                        vurdering={aktivitetForm.delvilkår.lønnet}
                        oppdaterVurdering={(vurdering: Vurdering) =>
                            oppdaterDelvilkår('lønnet', vurdering)
                        }
                    />
                    <JaNeiVurdering
                        label="Sykepenger"
                        vurdering={aktivitetForm.delvilkår.mottarSykepenger}
                        oppdaterVurdering={(vurdering: Vurdering) =>
                            oppdaterDelvilkår('mottarSykepenger', vurdering)
                        }
                    />
                </>
            );

        default:
            return <Feilmelding>Mangler mapping av {aktivitetForm.type}</Feilmelding>;
    }
};

export default AktivitetVilkår;
