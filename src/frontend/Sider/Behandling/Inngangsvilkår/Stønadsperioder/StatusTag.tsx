import React from 'react';

import styled from 'styled-components';

import { Tag } from '@navikt/ds-react';

import { StønadsperiodeStatus } from '../typer/stønadsperiode';

const TagMaksBredde = styled(Tag)`
    max-width: fit-content;
`;

export const StatusTag: React.FC<{ status?: StønadsperiodeStatus }> = ({ status }) => {
    if (status === StønadsperiodeStatus.ENDRET) {
        return (
            <TagMaksBredde size="small" variant="warning">
                Endret
            </TagMaksBredde>
        );
    }

    if (status === StønadsperiodeStatus.NY) {
        return (
            <TagMaksBredde size="small" variant="success">
                Ny
            </TagMaksBredde>
        );
    }

    return null;
};
