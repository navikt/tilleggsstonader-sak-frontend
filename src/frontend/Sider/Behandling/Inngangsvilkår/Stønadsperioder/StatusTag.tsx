import React from 'react';

import styled from 'styled-components';

import { Tag } from '@navikt/ds-react';

import { StønadsperiodeStatus } from '../typer/stønadsperiode';

const StyledTag = styled(Tag)`
    max-width: fit-content;
    min-height: 20px;
`;

export const StatusTag: React.FC<{ status?: StønadsperiodeStatus }> = ({ status }) => {
    if (status === StønadsperiodeStatus.ENDRET) {
        return (
            <StyledTag size="small" variant="warning">
                Endret
            </StyledTag>
        );
    }

    if (status === StønadsperiodeStatus.NY) {
        return (
            <StyledTag size="small" variant="success">
                Ny
            </StyledTag>
        );
    }

    return null;
};
