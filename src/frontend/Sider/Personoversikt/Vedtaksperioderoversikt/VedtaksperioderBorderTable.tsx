import styled from 'styled-components';

import { Table } from '@navikt/ds-react';
import { AGray500 } from '@navikt/ds-tokens/dist/tokens';

export const BorderTable = styled(Table)<{ $border?: boolean }>`
    border: ${(props) => (props.$border ? `solid 1px ${AGray500}` : 'none')};
`;
