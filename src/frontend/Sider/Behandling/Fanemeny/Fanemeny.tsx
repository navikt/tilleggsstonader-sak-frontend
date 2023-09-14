import * as React from 'react';
import { FC } from 'react';

import styled from 'styled-components';

import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import Fane from './Fane';
import { behandlingFaner } from './faner';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';

const Container = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 3rem;
    z-index: 22;
    display: flex;
    border-bottom: ${ABorderDefault} solid 2px;
`;

const Fanemeny: FC<{ behandlingId: string; aktivFane: string }> = ({ behandlingId, aktivFane }) => {
    return (
        <Container>
            {behandlingFaner.map((side, indeks) => (
                <Fane
                    fane={side}
                    behandlingId={behandlingId}
                    index={indeks}
                    deaktivert={indeks === 3 || indeks === 4}
                    key={indeks}
                    erAktivFane={aktivFane === side.path}
                />
            ))}
        </Container>
    );
};

export default Fanemeny;
