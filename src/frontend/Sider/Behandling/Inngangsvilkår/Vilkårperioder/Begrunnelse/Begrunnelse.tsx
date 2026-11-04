import React from 'react';

import { Textarea } from '@navikt/ds-react';

import styles from './Begrunnelse.module.css';
import { BegrunnelseGrunner, begrunnelseTilTekst } from './utils';

interface Props {
    begrunnelse?: string;
    oppdaterBegrunnelse: (nyBegrunnelse: string) => void;
    begrunnelseGrunner: BegrunnelseGrunner[];
    feil?: string;
}

const Begrunnelse: React.FC<Props> = ({
    begrunnelse,
    oppdaterBegrunnelse,
    begrunnelseGrunner,
    feil,
}) => {
    const begrunnelseSuffix = begrunnelseGrunner.length > 0 ? '(obligatorisk)' : '(valgfri)';

    return (
        <Textarea
            autoComplete="off"
            label={`Begrunnelse ${begrunnelseSuffix}`}
            description={
                begrunnelseGrunner.length > 0 && (
                    <>
                        Du må begrunne:
                        <ul className={styles.liste}>
                            {begrunnelseGrunner.map((begrunnelseGrunn, indeks) => (
                                <li key={indeks}>{begrunnelseTilTekst[begrunnelseGrunn]}</li>
                            ))}
                        </ul>
                    </>
                )
            }
            value={begrunnelse || ''}
            onChange={(e) => oppdaterBegrunnelse(e.target.value)}
            size="small"
            error={feil}
        />
    );
};

export default Begrunnelse;
