import * as React from 'react';

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';
import { ABlue400, AGray100, AGray400, ATextAction } from '@navikt/ds-tokens/dist/tokens';

import { ISide } from './sider';
import { useKlageApp } from '../../context/KlageAppContext';

const StyledNavLink = styled(NavLink)`
    border-bottom: 5px solid white;
    color: inherit;
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 5px;
    padding-right: 5px;
    &:hover {
        border-bottom: 5px solid ${ABlue400};
        p {
            color: ${ATextAction};
        }
    }
    &.active {
        background-color: ${AGray100};
        border-bottom: 5px solid ${ATextAction};

        .typo-normal {
            font-weight: bold;
        }
    }
`;

const StyledLenketekst = styled(BodyShort)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const StyledTekst = styled(BodyShort)`
    border-bottom: 5px solid white;
    color: ${AGray400};
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 5px;
    padding-right: 5px;
`;

interface Props {
    side: ISide;
    behandlingId: string;
    index: number;
    deaktivert: boolean;
}

const Fane: React.FC<Props> = ({ side, behandlingId, index, deaktivert }) => {
    const { gåTilUrl } = useKlageApp();
    const fanenavn = side.navn;
    return (
        <>
            {deaktivert && (
                <StyledTekst size={'small'}>
                    {index + 1}. {fanenavn}
                </StyledTekst>
            )}
            {!deaktivert && (
                <StyledNavLink
                    key={side.navn}
                    to={`/klagebehandling/${behandlingId}/${side.href}`}
                    onClick={(e) => {
                        e.preventDefault();
                        gåTilUrl(`/klagebehandling/${behandlingId}/${side.href}`);
                    }}
                >
                    <StyledLenketekst size={'small'}>
                        {index + 1}. {fanenavn}
                    </StyledLenketekst>
                </StyledNavLink>
            )}
        </>
    );
};

export default Fane;
