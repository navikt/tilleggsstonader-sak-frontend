import React, { SetStateAction } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import styles from './ÅrVelger.module.css';

interface Props {
    valgtÅr: number;
    settValgtÅr: React.Dispatch<SetStateAction<number>>;
    kanVelgeForrigeÅr: boolean;
    kanVelgeNesteÅr: boolean;
}
const ÅrVelger: React.FC<Props> = ({
    valgtÅr,
    settValgtÅr,
    kanVelgeForrigeÅr,
    kanVelgeNesteÅr,
}) => {
    return (
        <div className={styles.container}>
            <Button
                icon={<ChevronLeftIcon />}
                variant={'tertiary'}
                disabled={!kanVelgeForrigeÅr}
                onClick={() => settValgtÅr(valgtÅr - 1)}
                size={'small'}
            />
            {valgtÅr}
            <Button
                icon={<ChevronRightIcon />}
                variant={'tertiary'}
                disabled={!kanVelgeNesteÅr}
                onClick={() => settValgtÅr(valgtÅr + 1)}
                size={'small'}
            />
        </div>
    );
};

export default ÅrVelger;
