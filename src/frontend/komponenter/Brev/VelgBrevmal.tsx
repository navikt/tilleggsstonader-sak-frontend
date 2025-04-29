import React from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { Brevmal } from './typer';
import { useBrevFeilContext } from '../../context/BrevFeilContext';

const Container = styled.div`
    max-width: fit-content;
`;

interface Props {
    brevmaler: Brevmal[];
    brevmal?: string;
    settBrevmal: (brevmal: string) => void;
}

const VelgBrevmal: React.FC<Props> = ({ brevmaler, brevmal, settBrevmal }) => {
    const { nullstillFeilIBrev } = useBrevFeilContext();

    const handleOnChange = (event: string) => {
        settBrevmal(event);
        nullstillFeilIBrev();
    };

    return (
        <Container>
            <Select
                label="Velg brevmal"
                onChange={(e) => handleOnChange(e.target.value)}
                value={brevmal || ''}
                size="small"
            >
                <option value="">Velg</option>
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
