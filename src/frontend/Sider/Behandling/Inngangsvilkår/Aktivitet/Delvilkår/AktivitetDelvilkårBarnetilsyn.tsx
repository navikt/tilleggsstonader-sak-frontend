import React from 'react';

import styles from './AktivitetDelvilkårBarnetilsyn.module.css';
import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormBarnetilsyn } from '../EndreAktivitetBarnetilsyn';
import { skalVurdereLønnet } from '../utilsBarnetilsyn';

export const AktivitetDelvilkårBarnetilsyn: React.FC<{
    aktivitetForm: EndreAktivitetFormBarnetilsyn;
    oppdaterLønnet: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereLønnet(aktivitetForm.type)) return null;

    return (
        <div className={styles.container}>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
        </div>
    );
};
