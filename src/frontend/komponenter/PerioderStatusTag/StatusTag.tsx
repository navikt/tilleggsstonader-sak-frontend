import React from 'react';

import styled from 'styled-components';

import { Tag } from '@navikt/ds-react';

import { PeriodeStatus } from '../../typer/behandling/periodeStatus';

const StyledTag = styled(Tag)`
    max-width: fit-content;
    min-height: 20px;
`;

export const StatusTag: React.FC<{ status?: PeriodeStatus; lesevisning: boolean }> = ({
    status,
    lesevisning,
}) => {
    if (status === PeriodeStatus.UENDRET) {
        return (
            <StyledTag size="small" variant="warning">
                Fra tidligere vedtak
            </StyledTag>
        );
    }

    if (status === PeriodeStatus.ENDRET) {
        return (
            <StyledTag size="small" variant="warning">
                Endret
            </StyledTag>
        );
    }

    if (lesevisning && status === PeriodeStatus.NY) {
        return (
            <StyledTag size="small" variant="success">
                Ny
            </StyledTag>
        );
    }

    return null;
};
