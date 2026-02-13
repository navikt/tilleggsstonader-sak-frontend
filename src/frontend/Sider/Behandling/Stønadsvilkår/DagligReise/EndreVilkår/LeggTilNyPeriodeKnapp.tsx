import React, { useRef } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { ErrorMessage, Popover } from '@navikt/ds-react';

import styles from './EndreVilkårDagligReise.module.css';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';

export const LeggTilNyPeriodeKnapp: React.FC<{
    onKlikk: () => void;
    feilmelding: string | undefined;
    onLukkFeilmelding: () => void;
}> = ({ onKlikk, feilmelding, onLukkFeilmelding }) => {
    const buttonRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={buttonRef} className={styles.buttonContainer}>
                <SmallButton onClick={onKlikk} variant="secondary" icon={<PlusCircleIcon />}>
                    Legg til ny periode
                </SmallButton>
            </div>
            <Popover
                anchorEl={buttonRef.current}
                open={!!feilmelding}
                onClose={onLukkFeilmelding}
                placement="top"
            >
                <Popover.Content className={styles.popoverContent}>
                    <ErrorMessage size="small">{feilmelding}</ErrorMessage>
                </Popover.Content>
            </Popover>
        </>
    );
};
