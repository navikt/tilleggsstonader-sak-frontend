import styled from 'styled-components';

export const Celle = styled.div<{ $width?: number }>`
    max-width: ${({ $width = 250 }) => $width}px;

    /**
    Bryter setninger på space, lange ord på hyphens, og lange ord brytes med hyphens. 
     */
    word-break: auto-phrase;
    hyphens: auto;
`;
