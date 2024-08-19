import React from 'react';

import styled from 'styled-components';

import { ErrorMessage } from '@navikt/ds-react';
import { FamilieTextarea, IFamilieTextareaProps } from '@navikt/familie-form-elements';

const StyledFamilieTextArea: React.FC<IFamilieTextareaProps> = styled(FamilieTextarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    .typo-element {
        padding-bottom: 0.5rem;
    }
`;

type Props = { feilmelding?: string } & IFamilieTextareaProps;

export const EnsligTextArea: React.FC<Props> = ({
    value,
    onChange,
    label,
    maxLength,
    erLesevisning,
    feilmelding,
}) => {
    return (
        <>
            <StyledFamilieTextArea
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange && onChange(e)}
                label={label}
                maxLength={maxLength}
                erLesevisning={erLesevisning}
            />
            <ErrorMessage>{feilmelding}</ErrorMessage>
        </>
    );
};
