import React from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { Brevmal } from './typer';

export const Container = styled.div`
    max-width: 55rem;
`;

interface Props {
    brevmaler: Brevmal[];
    brevmal?: string;
    settBrevmal: (brevmal: string) => void;
}
const VelgBrevmal: React.FC<Props> = ({ brevmaler, brevmal, settBrevmal }) => {
    return (
        <Container>
            <Select
                label="Velg brevmal"
                onChange={(e) => {
                    settBrevmal(e.target.value);
                }}
                value={brevmal || ''}
            >
                <option value="">Ikke valgt</option>
                {brevmaler.map((mal) => (
                    <option value={mal._id} key={mal._id}>
                        {mal.visningsnavn}
                    </option>
                ))}
            </Select>
        </Container>
    );
};

export default VelgBrevmal;
