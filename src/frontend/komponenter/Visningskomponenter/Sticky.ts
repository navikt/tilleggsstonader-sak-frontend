import styled from 'styled-components';

export const Sticky = styled.div<{ $zIndex?: number }>`
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: ${(props) => props.$zIndex ?? 24};
    background-color: white;
`;
