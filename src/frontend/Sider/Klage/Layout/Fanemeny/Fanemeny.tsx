import * as React from 'react';
import { FC } from 'react';

import Fane from './Fane';
import styles from './Fanemeny.module.css';
import { alleSider, ISide, SideNavn } from './sider';
import { Sticky } from '../../../../komponenter/Visningskomponenter/Sticky';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { KlagebehandlingResultat } from '../../typer/klagebehandling/klagebehandlingResultat';
import {
    KlagebehandlingSteg,
    stegrekkefølge,
} from '../../typer/klagebehandling/klagebehandlingSteg';

interface Props {
    behandling: Klagebehandling;
}

const Fanemeny: FC<Props> = ({ behandling }) => {
    const { formkravOppfylt } = useKlagebehandling();
    const faneErLåst = (side: ISide, steg: KlagebehandlingSteg): boolean => {
        if (side.navn === SideNavn.VURDERING) {
            return !formkravOppfylt;
        }
        if (
            side.navn === SideNavn.BREV &&
            behandling.resultat === KlagebehandlingResultat.HENLAGT
        ) {
            return true;
        }
        return side.rekkefølge > stegrekkefølge[steg];
    };

    return (
        <Sticky className={styles.stickyMedBoxShadow}>
            <div className={styles.fanemeny}>
                {alleSider.map((side, index) => (
                    <Fane
                        side={side}
                        behandlingId={behandling.id}
                        index={index}
                        deaktivert={faneErLåst(side, behandling.steg)}
                        key={index}
                    />
                ))}
            </div>
        </Sticky>
    );
};

export default Fanemeny;
