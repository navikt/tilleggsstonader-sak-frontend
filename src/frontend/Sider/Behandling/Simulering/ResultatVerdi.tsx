import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';
import { AGreen500, ARed500 } from '@navikt/ds-tokens/dist/tokens';

/**
 * Komponent for å vise en verdi med farge rød eller grønn basert på om verdien er positiv eller negativ.
 */
export const ResultatVerdi = styled(BodyShort)<{ $verdi: number }>`
    color: ${(props) => props.$verdi && (props.$verdi > 0 ? AGreen500 : ARed500)};
`;
