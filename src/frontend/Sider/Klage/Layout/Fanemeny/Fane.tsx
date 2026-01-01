import * as React from 'react';

import { NavLink } from 'react-router-dom';

import { BodyShort } from '@navikt/ds-react';

import styles from './Fane.module.css';
import { ISide } from './sider';
import { useKlageApp } from '../../context/KlageAppContext';

interface Props {
    side: ISide;
    behandlingId: string;
    index: number;
    deaktivert: boolean;
}

const Fane: React.FC<Props> = ({ side, behandlingId, index, deaktivert }) => {
    const { gåTilUrl } = useKlageApp();
    const fanenavn = side.navn;
    return (
        <>
            {deaktivert && (
                <BodyShort size={'small'} className={styles.text}>
                    {index + 1}. {fanenavn}
                </BodyShort>
            )}
            {!deaktivert && (
                <NavLink
                    key={side.navn}
                    to={`/klagebehandling/${behandlingId}/${side.href}`}
                    onClick={(e) => {
                        e.preventDefault();
                        gåTilUrl(`/klagebehandling/${behandlingId}/${side.href}`);
                    }}
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                >
                    <BodyShort size={'small'} className={styles.linkText}>
                        {index + 1}. {fanenavn}
                    </BodyShort>
                </NavLink>
            )}
        </>
    );
};

export default Fane;
