import React from 'react';

import styles from './AktivitetDelvilkårPassAvBarn.module.css';
import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormPassAvBarn } from '../EndreAktivitetPassAvBarn';
import { skalVurdereLønnet } from '../utilsPassAvBarn';

export const AktivitetDelvilkårPassAvBarn: React.FC<{
    aktivitetForm: EndreAktivitetFormPassAvBarn;
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
