import React from 'react';

import { Switch } from '@navikt/ds-react';

import styles from './EndreErFremtidigUtgift.module.css';
import { StønadsvilkårType } from '../../vilkår';

const EndreErFremtidigUtgift: React.FC<{
    vilkårtype: StønadsvilkårType;
    kanVæreFremtidigUtgift?: boolean;
    erFremtidigUtgift?: boolean;
    oppdaterErFremtidigUtgift: (verdi: boolean) => void;
}> = ({ vilkårtype, kanVæreFremtidigUtgift, erFremtidigUtgift, oppdaterErFremtidigUtgift }) => {
    return (
        <>
            {vilkårtype === StønadsvilkårType.UTGIFTER_OVERNATTING && kanVæreFremtidigUtgift && (
                <Switch
                    className={styles.switch}
                    size={'small'}
                    checked={erFremtidigUtgift ?? false}
                    onChange={(e) => oppdaterErFremtidigUtgift(e.target.checked)}
                >
                    Fremtidig utgift
                </Switch>
            )}
        </>
    );
};

export default EndreErFremtidigUtgift;
