import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Textarea, VStack } from '@navikt/ds-react';

import { BegrunnelseRegel, BegrunnelseType, Regel, RegelId } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settBegrunnelse: (regelId: RegelId, tekst: BegrunnelseType) => void;
}

const BegrunnelseContainer = styled(VStack)`
    width: 250px;
`;

const Begrunnelse: FC<Props> = ({ vurdering, settBegrunnelse, regel }) => {
    const typeBegrunnelse = vurdering.svar && regel.svarMapping[vurdering.svar].begrunnelseType;
    const skjulBegrunnelse = typeBegrunnelse === BegrunnelseRegel.UTEN;

    if (skjulBegrunnelse) {
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
                value={vurdering.begrunnelse}
                onChange={(e) => settBegrunnelse(vurdering.regelId, e.target.value)}
            />
        </BegrunnelseContainer>
    );
};
export default Begrunnelse;
