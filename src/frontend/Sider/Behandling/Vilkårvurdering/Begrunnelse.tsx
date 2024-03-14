import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Textarea, VStack } from '@navikt/ds-react';

import { BegrunnelseRegel } from '../../../typer/regel';

interface Props {
    gjeldendeBegrunnelse: string | null;
    typeBegrunnelse: BegrunnelseRegel;
    settBegrunnelse: (tekst: string | undefined) => void;
}

const BegrunnelseContainer = styled(VStack)`
    width: 250px;
`;

const Begrunnelse: FC<Props> = ({ gjeldendeBegrunnelse, settBegrunnelse, typeBegrunnelse }) => {
    if (typeBegrunnelse === BegrunnelseRegel.UTEN) {
        return null;
    }

    const begrunnelsestekst = 'Begrunnelse '.concat(
        typeBegrunnelse === BegrunnelseRegel.PÅKREVD ? '(obligatorisk)' : '(valgfri)'
    );

    return (
        <BegrunnelseContainer>
            <Textarea
                label={begrunnelsestekst}
                resize
                size="small"
                minRows={3}
                value={gjeldendeBegrunnelse || undefined}
                onChange={(e) => settBegrunnelse(e.target.value)}
            />
        </BegrunnelseContainer>
    );
};
export default Begrunnelse;
