import * as React from 'react';
import { FC } from 'react';

import styled from 'styled-components';

import { BgDefault, BorderNeutralSubtle } from '@navikt/ds-tokens/darkside-js';

import FatteVedtak from './FatteVedtak';
import SendtTilBeslutter from './SendtTilBeslutter';
import TotrinnskontrollUnderkjent from './TotrinnskontrollUnderkjent';
import { TotrinnskontrollResponse, TotrinnskontrollStatus } from './typer';
import { Ressurs } from '../../../typer/ressurs';

const BorderBox = styled.div`
    border: 1px solid ${BorderNeutralSubtle};
    background-color: ${BgDefault};
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.125rem;
`;

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
                <BorderBox>
                    <FatteVedtak
                        settVisGodkjentModal={settVisModalGodkjent}
                        settTotrinnskontroll={settTotrinnskontroll}
                        totrinnskontroll={totrinnskontroll.totrinnskontroll}
                    />
                </BorderBox>
            );
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return (
                <BorderBox>
                    <TotrinnskontrollUnderkjent
                        totrinnskontroll={totrinnskontroll.totrinnskontroll}
                    />
                </BorderBox>
            );
        case TotrinnskontrollStatus.IKKE_AUTORISERT:
            return (
                <BorderBox>
                    <SendtTilBeslutter
                        totrinnskontroll={totrinnskontroll.totrinnskontroll}
                        settTotrinnskontroll={settTotrinnskontroll}
                    />
                </BorderBox>
            );
        default:
            return null;
    }
};
