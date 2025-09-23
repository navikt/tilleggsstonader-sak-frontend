import styled from 'styled-components';

import { Link } from '@navikt/ds-react';
import { BgMetaPurpleStrong } from '@navikt/ds-tokens/darkside-js';

export const Lenke = styled(Link)`
    &:visited {
        color: ${BgMetaPurpleStrong};
    }
`;
