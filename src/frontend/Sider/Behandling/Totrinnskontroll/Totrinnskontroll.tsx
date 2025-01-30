import * as React from 'react';
import { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';

import FatteVedtak from './FatteVedtak';
import SendtTilBeslutter from './SendtTilBeslutter';
import TotrinnskontrollUnderkjent from './TotrinnskontrollUnderkjent';
import { TotrinnskontrollResponse, TotrinnskontrollStatus } from './typer';
import { useTotrinnskontroll } from '../../../context/TotrinnskontrollContext';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';

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

const Totrinnskontroll: FC = () => {
    const navigate = useNavigate();

    const [visGodkjentModal, settVisGodkjentModal] = useState(false);

    const { totrinnskontroll, settTotrinnskontroll } = useTotrinnskontroll();

    const skalViseTotrinnskontrollSwitch =
        totrinnskontroll.status === RessursStatus.SUKSESS &&
        totrinnskontroll.data.status !== TotrinnskontrollStatus.UAKTUELT;

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
