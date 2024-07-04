import * as React from 'react';
import { useEffect, useState } from 'react';
import Valgvisning from './Valgvisning';
import Historikk from './Historikk';
import Dokumenter from './Dokumenter';
import styled from 'styled-components';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { AIconInfo } from '@navikt/ds-tokens/dist/tokens';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Klagebehandling } from '../../../App/typer/klagebehandling/klagebehandling';

interface IHøyremenyProps {
    behandling: Klagebehandling;
    åpenHøyremeny: boolean;
}

const PilVenstreIkon = styled(ChevronLeftIcon)`
    border-radius: 0;
    margin-top: 3px;
    margin-right: 2px;
    color: white;
`;

const PilHøyreIkon = styled(ChevronRightIcon)`
    border-radius: 0;
    margin-top: 3px;
    color: white;
`;

const ÅpneLukkeKnapp = styled.button`
    position: absolute;
    background-color: ${AIconInfo};
    margin-left: -12px;
    top: 200px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    z-index: 22;
`;

const StyledHøyremeny = styled.div`
    width: 100%;
`;

export enum Høyremenyvalg {
    Historikk = 'Historikk',
    Dokumenter = 'Dokumenter',
}

const Høyremeny: React.FC<IHøyremenyProps> = ({ åpenHøyremeny, behandling }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Historikk);
    const { settÅpenHøyremeny, behandlingErRedigerbar } = useBehandling();

    useEffect(() => {
        if (behandlingErRedigerbar) {
            settAktivtvalg(Høyremenyvalg.Historikk);
        }
    }, [behandling, behandlingErRedigerbar]);

    return (
        <>
            {åpenHøyremeny ? (
                <>
                    <StyledHøyremeny>
                        <ÅpneLukkeKnapp
                            onClick={() => {
                                settÅpenHøyremeny(!åpenHøyremeny);
                            }}
                        >
                            <PilHøyreIkon />
                        </ÅpneLukkeKnapp>
                        <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                        <Dokumenter hidden={aktivtValg !== Høyremenyvalg.Dokumenter} />
                        <Historikk hidden={aktivtValg !== Høyremenyvalg.Historikk} />
                    </StyledHøyremeny>
                </>
            ) : (
                <ÅpneLukkeKnapp
                    onClick={() => {
                        settÅpenHøyremeny(!åpenHøyremeny);
                    }}
                >
                    <PilVenstreIkon />
                </ÅpneLukkeKnapp>
            )}
        </>
    );
};

export default Høyremeny;
