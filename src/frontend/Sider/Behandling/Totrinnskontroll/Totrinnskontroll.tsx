import * as React from 'react';
import { FC, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';

import FatteVedtak from './FatteVedtak';
import { TotrinnskontrollResponse, TotrinnskontrollStatus } from './typer';
import { useBehandling } from '../../../context/BehandlingContext';
import { useHentTotrinnskontroll } from '../../../hooks/useHentTotrinnskontroll';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';
import { RessursStatus } from '../../../typer/ressurs';

const BorderBox = styled.div`
    border: 1px solid ${ABorderSubtle};
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;
`;

const TotrinnskontrollSwitch: FC<{
    totrinnskontroll: TotrinnskontrollResponse;
    settVisModalGodkjent: (vis: boolean) => void;
}> = ({ totrinnskontroll, settVisModalGodkjent }) => {
    switch (totrinnskontroll.status) {
        case TotrinnskontrollStatus.KAN_FATTE_VEDTAK:
            return <FatteVedtak settVisGodkjentModal={settVisModalGodkjent} />;
        default:
            return null;
    }
};

const Totrinnskontroll: FC = () => {
    const navigate = useNavigate();
    const { behandling } = useBehandling();
    const [visGodkjentModal, settVisGodkjentModal] = useState(false);

    const { totrinnskontroll, hentTotrinnskontroll } = useHentTotrinnskontroll();

    // TODO denne skal oppdateres
    useEffect(() => {
        hentTotrinnskontroll(behandling.id);
    }, [behandling.id, hentTotrinnskontroll]);

    if (
        totrinnskontroll.status !== RessursStatus.SUKSESS ||
        totrinnskontroll.data.status == TotrinnskontrollStatus.UAKTUELT
    ) {
        return null;
    }

    return (
        <>
            <BorderBox>
                <TotrinnskontrollSwitch
                    totrinnskontroll={totrinnskontroll.data}
                    settVisModalGodkjent={settVisGodkjentModal}
                />
            </BorderBox>
            <ModalWrapper
                tittel={'Vedtaket er godkjent'}
                visModal={visGodkjentModal}
                onClose={() => settVisGodkjentModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => navigate('/oppgavebenk'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: { onClick: () => settVisGodkjentModal(false), tekst: 'Lukk' },
                    marginTop: 4,
                }}
            />
        </>
    );
};

export default Totrinnskontroll;
