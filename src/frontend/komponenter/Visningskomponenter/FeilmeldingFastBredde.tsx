import styled from 'styled-components';

export const FeilmeldingMaksBredde = styled.div<{ $maxWidth?: number }>`
    .navds-error-message {
        max-width: ${({ $maxWidth: $width = 130 }) => $width}px;
    }
`;
