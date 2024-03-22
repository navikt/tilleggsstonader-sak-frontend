import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Textarea, VStack } from '@navikt/ds-react';

import { Begrunnelsestype } from '../vilkår';

interface Props {
    begrunnelsestype: Begrunnelsestype;
    gjeldendeBegrunnelse?: string;
    settBegrunnelse: (tekst: string | undefined) => void;
}

const BegrunnelseContainer = styled(VStack)`
    width: 250px;
`;

const Begrunnelse: FC<Props> = ({ gjeldendeBegrunnelse, settBegrunnelse, begrunnelsestype }) => {
    if (begrunnelsestype === 'UTEN') {
        return null;
    }

    const begrunnelsestekst = 'Begrunnelse '.concat(
        begrunnelsestype === 'PÅKREVD' ? '(obligatorisk)' : '(valgfri)'
    );

    return (
        <BegrunnelseContainer>
            <Textarea
                label={begrunnelsestekst}
                resize
                size="small"
                minRows={3}
                value={gjeldendeBegrunnelse}
                onChange={(e) => settBegrunnelse(e.target.value)}
            />
        </BegrunnelseContainer>
    );
};
export default Begrunnelse;
