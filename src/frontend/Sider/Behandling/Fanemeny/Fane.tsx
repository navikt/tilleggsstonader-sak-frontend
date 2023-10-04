import * as React from 'react';

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';
import {
    ABlue400,
    ABlue500,
    AGray100,
    ATextAction,
    ATextDefault,
} from '@navikt/ds-tokens/dist/tokens';

import { FanerMedRouter } from './faner';

const Container = styled.div<{ deaktivert?: boolean }>`
    width: 100%;
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

    border-bottom: 5px solid white;

    .navds-body-short {
        color: ${AGray100};
    }
`;

const ContainerAktivert = styled(Container)`
    .navds-body-short {
        color: ${ATextDefault};
    }

    &:hover {
        border-bottom-color: ${ABlue400};

        .navds-body-short {
            color: ${ATextAction};
        }
    }

    &.active {
        background-color: ${AGray100};
        border-bottom-color: ${ABlue500};

        .navds-body-short {
            font-weight: bold;
        }
    }
`;

const Lenke = styled(NavLink)`
    text-decoration: none;
    width: 100%;
    height: 100%;
`;

interface Props {
    fane: FanerMedRouter;
    behandlingId: string;
    index: number;
    deaktivert: boolean;
    erAktivFane: boolean;
}

const Fane: React.FC<Props> = ({ fane, behandlingId, index, deaktivert, erAktivFane }) => {
    return (
        <>
            {deaktivert ? (
                <Container>
                    <BodyShort size="small">
                        {index + 1}. {fane.navn}
                    </BodyShort>
                </Container>
            ) : (
                <Lenke key={fane.navn} to={`/behandling/${behandlingId}/${fane.path}`}>
                    <ContainerAktivert className={erAktivFane ? 'active' : ''}>
                        <BodyShort size="small">
                            {index + 1}. {fane.navn}
                        </BodyShort>
                    </ContainerAktivert>
                </Lenke>
            )}
        </>
    );
};

export default Fane;
