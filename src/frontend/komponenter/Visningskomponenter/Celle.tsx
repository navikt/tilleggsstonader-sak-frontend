import styled from 'styled-components';

export const Celle = styled.div<{ $width?: number }>`
    max-width: ${({ $width = 250 }) => $width}px;
`;
