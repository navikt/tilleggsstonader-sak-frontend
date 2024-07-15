import { Link } from '@navikt/ds-react';
import { APurple500 } from '@navikt/ds-tokens/dist/tokens';
import styled from 'styled-components';

export const Lenke = styled(Link)`
    &:visited {
        color: ${APurple500};
    }
`;
