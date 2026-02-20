import * as React from 'react';
import { useState } from 'react';

import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';

import styles from './SendtTilBeslutter.module.css';
import { TotrinnskontrollOpprettet, TotrinnskontrollResponse } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { formaterIsoDatoTid } from '../../../utils/dato';

const SendtTilBeslutter: React.FC<{
    totrinnskontroll: TotrinnskontrollOpprettet;
    settTotrinnskontroll: React.Dispatch<React.SetStateAction<Ressurs<TotrinnskontrollResponse>>>;
}> = ({ totrinnskontroll, settTotrinnskontroll }) => {
    const { request, saksbehandler } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState(false);

    const angreSendTilBeslutter = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        settFeilmelding('');
        request<TotrinnskontrollResponse, null>(
            `/api/sak/totrinnskontroll/${behandling.id}/angre-send-til-beslutter`,
            'POST'
        )
            .then((response: RessursSuksess<TotrinnskontrollResponse> | RessursFeilet) => {
                if (response.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    settTotrinnskontroll(response);
                    //hentBehandlingshistorikk.rerun();
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };

    return (
        <VStack gap="space-8">
            <Heading size={'small'} level={'3'}>
                Totrinnskontroll
            </Heading>
            <Alert variant={'info'} inline={true} size="small">
                Vedtaket er sendt til godkjenning
            </Alert>
            <div>
                <BodyShort size={'small'}>{totrinnskontroll.opprettetAv}</BodyShort>
                <BodyShort size={'small'}>
                    {formaterIsoDatoTid(totrinnskontroll.opprettetTid)}
                </BodyShort>
            </div>
            {totrinnskontroll.begrunnelse && (
                <BodyShort size="small">
                    <b>Kommentar til beslutter:</b> <br />
                    {totrinnskontroll.begrunnelse}
                </BodyShort>
            )}
            {totrinnskontroll.opprettetAv === saksbehandler.navIdent && (
                <div className={styles.angreContainer}>
                    <Button
                        size="small"
                        disabled={laster}
                        variant={'secondary'}
                        onClick={angreSendTilBeslutter}
                    >
                        Angre sendt til beslutter
                    </Button>
                    {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
                </div>
            )}
        </VStack>
    );
};

export default SendtTilBeslutter;
