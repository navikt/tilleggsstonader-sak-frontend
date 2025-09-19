import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';
import { TextDangerSubtle, TextSuccessSubtle } from '@navikt/ds-tokens/darkside-js';

/**
 * Komponent for å vise en verdi med farge rød eller grønn basert på om verdien er positiv eller negativ.
 */
export const ResultatVerdi = styled(BodyShort)<{ $verdi: number }>`
    color: ${(props) => props.$verdi && (props.$verdi > 0 ? TextSuccessSubtle : TextDangerSubtle)};
`;
