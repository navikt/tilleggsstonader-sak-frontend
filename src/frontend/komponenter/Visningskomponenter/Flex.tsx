import styled from 'styled-components';

export const FlexColumn = styled.div<{ $gap?: number }>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.$gap ?? 1}rem;
`;
