import * as React from 'react';
import { FC } from 'react';

import FatteVedtak from './FatteVedtak';
import SendtTilBeslutter from './SendtTilBeslutter';
import styles from './TotrinnskontrollSwitch.module.css';
import TotrinnskontrollUnderkjent from './TotrinnskontrollUnderkjent';
import { TotrinnskontrollResponse, TotrinnskontrollStatus } from './typer';
import { Ressurs } from '../../../typer/ressurs';

export const TotrinnskontrollSwitch: FC<{
    totrinnskontroll: TotrinnskontrollResponse;
    settVisModalGodkjent: (vis: boolean) => void;
    settTotrinnskontroll: React.Dispatch<React.SetStateAction<Ressurs<TotrinnskontrollResponse>>>;
}> = ({ totrinnskontroll, settVisModalGodkjent, settTotrinnskontroll }) => {
    switch (totrinnskontroll.status) {
        case TotrinnskontrollStatus.UAKTUELT:
            return null;
        case TotrinnskontrollStatus.KAN_FATTE_VEDTAK:
            return (
                <div className={styles.borderBox}>
                    <FatteVedtak
                        settVisGodkjentModal={settVisModalGodkjent}
                        settTotrinnskontroll={settTotrinnskontroll}
                        totrinnskontroll={totrinnskontroll.totrinnskontroll}
                    />
                </div>
            );
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return (
                <div className={styles.borderBox}>
                    <TotrinnskontrollUnderkjent
                        totrinnskontroll={totrinnskontroll.totrinnskontroll}
                    />
                </div>
            );
        case TotrinnskontrollStatus.IKKE_AUTORISERT:
            return (
                <div className={styles.borderBox}>
                    <SendtTilBeslutter
                        totrinnskontroll={totrinnskontroll.totrinnskontroll}
                        settTotrinnskontroll={settTotrinnskontroll}
                    />
                </div>
            );
        default:
            return null;
    }
};
