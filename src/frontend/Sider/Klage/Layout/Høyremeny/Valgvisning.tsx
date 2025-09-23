import * as React from 'react';

import styled from 'styled-components';

import { ClockFillIcon, FolderIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import {
    BgAccentStrong,
    BgInfoStrong,
    BgNeutralSoft,
    BorderAccent,
    BorderFocus,
} from '@navikt/ds-tokens/darkside-js';

import { Høyremenyvalg } from './Høyremeny';

const StyledIkonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${BorderFocus} solid 2px;
    text-align: center;
    .typo-normal {
        font-size: 12px;
        margin-top: -5px;
    }
`;

const StyledIkon = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'erAktiv',
})<{
    erAktiv: boolean;
}>`
    flex: 1;
    padding-top: 1rem;
    padding-bottom: 0.62rem;
    background-color: ${BgInfoStrong};
    color: ${BgAccentStrong};
    &:hover {
        cursor: pointer;
        svg {
            fill: ${BorderAccent};
        }
        border-bottom: 5px solid ${BorderAccent};
    }
    background-color: ${(props) => (props.erAktiv ? BgNeutralSoft : 'white')};
    border-bottom: 5px solid ${(props) => (props.erAktiv ? BorderAccent : 'white')};
`;

interface ValgvisningProps {
    settAktiv: (aktivtValg: Høyremenyvalg) => void;
    aktiv: Høyremenyvalg;
}

const Valgvisning: React.FC<ValgvisningProps> = ({ aktiv, settAktiv }) => {
    return (
        <StyledIkonWrapper>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Historikk}
                onClick={() => settAktiv(Høyremenyvalg.Historikk)}
            >
                <ClockFillIcon aria-label="Historikk" fontSize="1.5rem" />
                <BodyShort size={'small'}>Historikk</BodyShort>
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Dokumenter}
                onClick={() => settAktiv(Høyremenyvalg.Dokumenter)}
            >
                <FolderIcon aria-label="Dokumentoversikt" fontSize="1.5rem" />
                <BodyShort size={'small'}>Dokumenter</BodyShort>
            </StyledIkon>
        </StyledIkonWrapper>
    );
};

export default Valgvisning;
