import * as React from 'react';
import { FC, useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';

import FatteVedtak from './FatteVedtak';
import SendtTilBeslutter from './SendtTilBeslutter';
import TotrinnskontrollUnderkjent from './TotrinnskontrollUnderkjent';
import { TotrinnskontrollResponse, TotrinnskontrollStatus } from './typer';
import { useBehandling } from '../../../context/BehandlingContext';
import { useHentTotrinnskontroll } from '../../../hooks/useHentTotrinnskontroll';
import { usePrevious } from '../../../hooks/usePrevious';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { Behandling } from '../../../typer/behandling/behandling';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { Toggle } from '../../../utils/toggles';

const BorderBox = styled.div`
    border: 1px solid ${ABorderSubtle};
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;
`;

const TotrinnskontrollSwitch: FC<{
    totrinnskontroll: TotrinnskontrollResponse;
    settVisModalGodkjent: (vis: boolean) => void;
    settTotrinnskontroll: React.Dispatch<React.SetStateAction<Ressurs<TotrinnskontrollResponse>>>;
}> = ({ totrinnskontroll, settVisModalGodkjent, settTotrinnskontroll }) => {
    switch (totrinnskontroll.status) {
        case TotrinnskontrollStatus.UAKTUELT:
            return null;
        case TotrinnskontrollStatus.KAN_FATTE_VEDTAK:
            return (
                <FatteVedtak
                    settVisGodkjentModal={settVisModalGodkjent}
                    settTotrinnskontroll={settTotrinnskontroll}
                />
            );
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return (
                <TotrinnskontrollUnderkjent totrinnskontroll={totrinnskontroll.totrinnskontroll} />
            );
        case TotrinnskontrollStatus.IKKE_AUTORISERT:
            return (
                <SendtTilBeslutter
                    totrinnskontroll={totrinnskontroll.totrinnskontroll}
                    settTotrinnskontroll={settTotrinnskontroll}
                />
            );
        default:
            return null;
    }
};

/**
 * Skal hente totrinnskontroll:
 *  * Første rendering av siden hvis status er UTREDES eller FATTER_VEDTAK
 *  * Hvis status går fra utredes til fatter vedtak (sender til totrinnskontroll)
 */
const skalHenteTotrinnskontroll = (
    prevBehandling: Behandling | undefined,
    behandling: Behandling
) => {
    const forrigeStatus = prevBehandling?.status;
    const nyStatus = behandling.status;
    const statusErUendret = forrigeStatus === nyStatus;

    if (statusErUendret) return false;
    // Init-henting / sender til beslutter (send til beslutter kan erstattes hvis den knappen blir flyttet fra brev)
    if (nyStatus === BehandlingStatus.FATTER_VEDTAK) return true;

    // Init-henting
    return !forrigeStatus && nyStatus === BehandlingStatus.UTREDES;
};
const Totrinnskontroll: FC = () => {
    const navigate = useNavigate();
    const { behandling } = useBehandling();
    const prevBehandling = usePrevious(behandling);

    const [visGodkjentModal, settVisGodkjentModal] = useState(false);

    const kanSaksbehandle = useFlag(Toggle.KAN_SAKSBEHANDLE);

    const { totrinnskontroll, hentTotrinnskontroll, settTotrinnskontroll } =
        useHentTotrinnskontroll();

    useEffect(() => {
        if (skalHenteTotrinnskontroll(prevBehandling, behandling)) {
            hentTotrinnskontroll(behandling.id);
        }
    }, [prevBehandling, behandling, hentTotrinnskontroll]);

    const skalViseTotrinnskontrollSwitch =
        totrinnskontroll.status === RessursStatus.SUKSESS &&
        totrinnskontroll.data.status !== TotrinnskontrollStatus.UAKTUELT;

    if (!kanSaksbehandle) {
        return null;
    }

    return (
        <>
            {skalViseTotrinnskontrollSwitch && (
                <BorderBox>
                    <TotrinnskontrollSwitch
                        totrinnskontroll={totrinnskontroll.data}
                        settVisModalGodkjent={settVisGodkjentModal}
                        settTotrinnskontroll={settTotrinnskontroll}
                    />
                </BorderBox>
            )}
            <ModalWrapper
                tittel={'Vedtaket er godkjent'}
                visModal={visGodkjentModal}
                onClose={() => settVisGodkjentModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => navigate('/'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: { onClick: () => settVisGodkjentModal(false), tekst: 'Lukk' },
                }}
            />
        </>
    );
};

export default Totrinnskontroll;
