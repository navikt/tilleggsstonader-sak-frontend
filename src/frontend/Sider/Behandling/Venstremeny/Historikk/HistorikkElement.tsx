import React from 'react';

import { Detail, Label } from '@navikt/ds-react';

import HendelseIkon from './HendelseIkon';
import styles from './HistorikkElement.module.css';
import Metadata from './Metadata';
import { hendelseTilHistorikkTekst, HistorikkHendelse } from './typer';
import { formaterIsoDatoTidKort } from '../../../../utils/dato';

const HistorikkElement: React.FC<{
    erSisteElementIListe: boolean;
    historikkHendelse: HistorikkHendelse;
}> = ({ historikkHendelse, erSisteElementIListe }) => {
    return (
        <li className={styles.container}>
            <div>
                <div className={styles.blaRunding}>
                    <HendelseIkon hendelse={historikkHendelse.hendelse} />
                </div>
                {!erSisteElementIListe && <div className={styles.line} />}
            </div>
            <div className={styles.innholdContainer}>
                <Label size="small">{hendelseTilHistorikkTekst[historikkHendelse.hendelse]}</Label>
                <Detail>
                    {formaterIsoDatoTidKort(historikkHendelse.endretTid)} |{' '}
                    {historikkHendelse.endretAvNavn}
                </Detail>
                {historikkHendelse.metadata && <Metadata metadata={historikkHendelse.metadata} />}
            </div>
        </li>
    );
};

export default HistorikkElement;
