import styled from 'styled-components';

import { Link } from '@navikt/ds-react';
import { APurple500 } from '@navikt/ds-tokens/dist/tokens';

export const Lenke = styled(Link)`
    &:visited {
        color: ${APurple500};
    }
`;
