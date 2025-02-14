import React from 'react';

import styled from 'styled-components';

import { Tag } from '@navikt/ds-react';

import { PeriodeStatus } from '../../../../typer/behandling/periodeStatus';

const StyledTag = styled(Tag)`
    max-width: fit-content;
    min-height: 20px;
`;

export const StatusTag: React.FC<{ status?: PeriodeStatus }> = ({ status }) => {
    if (status === PeriodeStatus.ENDRET) {
        return (
            <StyledTag size="small" variant="warning">
                Endret
            </StyledTag>
        );
    }

    if (status === PeriodeStatus.NY) {
        return (
            <StyledTag size="small" variant="success">
                Ny
            </StyledTag>
        );
    }

    return null;
};
