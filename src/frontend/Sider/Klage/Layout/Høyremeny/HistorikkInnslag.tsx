import * as React from 'react';

import { PersonCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Label } from '@navikt/ds-react';

import styles from './HistorikkInnslag.module.css';
import { Metadata } from './Metadata';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Behandlingshistorikk, hendelseTilTekst } from '../../typer/behandlingshistorikk';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { KlagebehandlingSteg } from '../../typer/klagebehandling/klagebehandlingSteg';
import { utledStegutfall } from '../../utils/behandlingsresultat';

interface IHistorikkOppdatering {
    behandling: Klagebehandling;
    historikk: Behandlingshistorikk;
}

const HistorikkInnslag: React.FunctionComponent<IHistorikkOppdatering> = ({
    behandling,
    historikk,
}) => {
    const { steg, hendelse, endretTid, endretAvNavn, metadata } = historikk;
    return (
        <div className={styles.innslag}>
            <div className={styles.ikon}>
                <PersonCircleIcon fontSize="1.5rem" />
                <div className={styles.stipletLinje} />
            </div>
            <div className={styles.tekst}>
                {}
                <Label size="small">{hendelseTilTekst[hendelse]}</Label>
                {hendelse === KlagebehandlingSteg.BEHANDLING_FERDIGSTILT && (
                    <BodyShort>{utledStegutfall(behandling, steg)}</BodyShort>
                )}
                <Detail>
                    {formaterIsoDatoTid(endretTid)} | {endretAvNavn}
                </Detail>
                {metadata && <Metadata metadata={metadata} />}
            </div>
        </div>
    );
};

export default HistorikkInnslag;
