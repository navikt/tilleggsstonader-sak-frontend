import styled from 'styled-components';

export const Celle = styled.div<{ $width?: number }>`
    width: ${({ $width = 'fit-content' }) => $width}px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    /**
    Bryter setninger på space, lange ord på hyphens, og lange ord brytes med hyphens. 
     */
    word-break: auto-phrase;
    hyphens: auto;
`;
