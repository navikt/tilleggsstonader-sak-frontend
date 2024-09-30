import styled from 'styled-components';

export const Celle = styled.div<{ $width?: number }>`
    width: ${({ $width = 180 }) => $width}px;
`;
