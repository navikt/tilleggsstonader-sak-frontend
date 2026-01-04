import React from 'react';

import { Textarea } from '@navikt/ds-react';

import styles from './Begrunnelse.module.css';
import { BegrunnelseGrunner, begrunnelseTilTekst } from './utils';

interface Props {
    begrunnelse?: string;
    oppdaterBegrunnelse: (nyBegrunnelse: string) => void;
    delvilkårSomKreverBegrunnelse: BegrunnelseGrunner[];
    feil?: string;
}

const Begrunnelse: React.FC<Props> = ({
    begrunnelse,
    oppdaterBegrunnelse,
    delvilkårSomKreverBegrunnelse,
    feil,
}) => {
    const begrunnelseSuffix =
        delvilkårSomKreverBegrunnelse.length > 0 ? '(obligatorisk)' : '(valgfri)';

    return (
        <Textarea
            label={`Begrunnelse ${begrunnelseSuffix}`}
            description={
                delvilkårSomKreverBegrunnelse.length > 0 && (
                    <>
                        Du må begrunne:
                        <ul className={styles.liste}>
                            {delvilkårSomKreverBegrunnelse.map((delvilkår, indeks) => (
                                <li key={indeks}>{begrunnelseTilTekst[delvilkår]}</li>
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
