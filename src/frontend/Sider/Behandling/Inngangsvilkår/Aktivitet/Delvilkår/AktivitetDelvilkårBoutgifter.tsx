import React from 'react';

import styles from './AktivitetDelvilkårBoutgifter.module.css';
import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormBoutgifter } from '../EndreAktivitetBoutgifter';
import { skalVurdereLønnet } from '../utilsBoutgifter';

export const AktivitetDelvilkårBoutgfiter: React.FC<{
    aktivitetForm: EndreAktivitetFormBoutgifter;
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
