import React, { FC, useState } from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';

import styles from './StatusElementer.module.css';
import { stønadstypeTilTekst } from '../../../../typer/behandling/behandlingTema';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { behandlingStatusTilTekst } from '../../typer/klagebehandling/klagebehandlingStatus';
import {
    behandlingResultatTilTekst,
    utledTekstForBehandlingsresultat,
} from '../../utils/behandlingsresultat';

export const GråTekst: FC<{ children: React.ReactNode }> = ({ children }) => (
    <BodyShort className={styles.graTekst}>{children}</BodyShort>
);

export const StatusMeny: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const [åpenStatusMeny, settÅpenStatusMeny] = useState<boolean>(false);

    return (
        <div>
            <Button
                variant="tertiary"
                onClick={() => {
                    settÅpenStatusMeny(!åpenStatusMeny);
                }}
                className={styles.visStatuserKnapp}
            >
                <ChevronDownIcon fontSize="1.5rem" />
            </Button>
            <div
                className={`${styles.statusMenyInnhold} ${åpenStatusMeny ? styles.statusMenyInnholdOpen : ''}`}
            >
                <ul>
                    <div className={styles.visStonadOgBehandlingstypePaLitenSkjerm}>
                        <li>
                            <div className={styles.status}>
                                <GråTekst>Stønadstype</GråTekst>
                                <BodyShort>{stønadstypeTilTekst[behandling.stønadstype]}</BodyShort>
                            </div>
                        </li>
                    </div>
                    <li>
                        <div className={styles.status}>
                            <GråTekst>Behandlingsstatus</GråTekst>
                            <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
                        </div>
                    </li>
                    <li>
                        <div className={styles.status}>
                            <GråTekst>Behandlingsresultat</GråTekst>
                            <BodyShort>{behandlingResultatTilTekst[behandling.resultat]}</BodyShort>
                        </div>
                    </li>
                    <li>
                        <div className={styles.status}>
                            <GråTekst>Opprettet</GråTekst>
                            <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
                        </div>
                    </li>
                    <li>
                        <div className={styles.status}>
                            <GråTekst>Sist endret</GråTekst>
                            <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export const StatuserLitenSkjerm: FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles.statuserLitenSkjerm}>{children}</div>
);

export const AlleStatuser: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    return (
        <div className={styles.statuser}>
            <div className={styles.status}>
                <GråTekst>Behandlingsstatus</GråTekst>
                <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
            </div>
            <div className={styles.status}>
                <GråTekst>Behandlingsresultat</GråTekst>
                <BodyShort>{utledTekstForBehandlingsresultat(behandling)}</BodyShort>
            </div>
            <div className={styles.status}>
                <GråTekst>Opprettet</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
            </div>
            <div className={styles.status}>
                <GråTekst>Sist endret</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
            </div>
        </div>
    );
};
