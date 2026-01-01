import * as React from 'react';

import { ReadMore } from '@navikt/ds-react';

import styles from './LesMerTekstInnstilling.module.css';

export const LesMerTekstInnstilling: React.FC = () => {
    return (
        <ReadMore
            size="small"
            header="Dette skal innstillingen inneholde"
            className={styles.lesMerTekst}
        >
            <ol>
                <li>
                    Hva klagesaken gjelder
                    <ol type="a">
                        <li>
                            Skriv kort om resultatet i vedtaket. Eksempel: Klagers søknad om tilsyn
                            barn ble avslått fordi hun mangler dokumentasjon på utgifter.
                        </li>
                    </ol>
                </li>
                <li>
                    Vurdering av klagen
                    <ol type="a">
                        <li>Begrunn hvorfor vi opprettholder vedtaket</li>
                        <li>Klagers argumenter skal vurderes/kommenteres</li>
                        <li>Avslutt med konklusjon og vis til hjemmel</li>
                    </ol>
                </li>
            </ol>
        </ReadMore>
    );
};
