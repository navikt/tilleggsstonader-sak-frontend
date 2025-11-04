import styled from 'styled-components';

import { VStack } from '@navikt/ds-react';
import { BorderNeutral } from '@navikt/ds-tokens/darkside-js';

export const BeregningsresultatContainer = styled(VStack)`
    border-radius: 12px;
    border: 1px solid ${BorderNeutral};

    padding: 1rem;
`;
