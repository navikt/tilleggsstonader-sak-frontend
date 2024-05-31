import React from 'react';
import styled from 'styled-components';
import { CopyButton } from '@navikt/ds-react';
import { formaterFødselsnummer } from '../App/utils/formatter';

const NoWrapSpan = styled.span`
    white-space: nowrap;
    font-size: 16px;
    display: flex;
    align-items: center;
`;

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string }> = ({
    fødselsnummer,
}) => {
    return (
        <NoWrapSpan>
            <span>{formaterFødselsnummer(fødselsnummer)}</span>
            <CopyButton
                size={'xsmall'}
                copyText={fødselsnummer}
                variant={'action'}
                activeText={'kopiert'}
            />
        </NoWrapSpan>
    );
};
