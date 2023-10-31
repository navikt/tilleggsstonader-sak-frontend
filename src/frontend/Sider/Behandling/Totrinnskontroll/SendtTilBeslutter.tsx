import * as React from 'react';
import { useState } from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';

import { TotrinnskontrollOpprettet } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { formaterIsoDatoTid } from '../../../utils/dato';

const AngreSendTilBeslutterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const SendtTilBeslutter: React.FC<{
    totrinnskontroll: TotrinnskontrollOpprettet;
}> = ({ totrinnskontroll }) => {
    const { request } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState(false);

    const angreSendTilBeslutter = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        settFeilmelding('');
        request<string, null>(`/api/sak/totrinnskontroll/${behandling.id}/angre-send-til-beslutter`)
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    //hentTotrinnskontroll.rerun();
                    //hentBehandlingshistorikk.rerun();
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };

    return (
        <>
            <Heading size={'small'} level={'3'}>
                Totrinnskontroll
            </Heading>
            <Alert variant={'info'} inline={true}>
                Vedtaket er sendt til godkjenning
            </Alert>
            <div>
                <BodyShort size={'small'}>{totrinnskontroll.opprettetAv}</BodyShort>
                <BodyShort size={'small'}>
                    {formaterIsoDatoTid(totrinnskontroll.opprettetTid)}
                </BodyShort>
            </div>
            <AngreSendTilBeslutterContainer>
                <Button
                    size="small"
                    disabled={laster}
                    variant={'secondary'}
                    onClick={angreSendTilBeslutter}
                >
                    Angre sendt til beslutter
                </Button>
                {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            </AngreSendTilBeslutterContainer>
        </>
    );
};

export default SendtTilBeslutter;
