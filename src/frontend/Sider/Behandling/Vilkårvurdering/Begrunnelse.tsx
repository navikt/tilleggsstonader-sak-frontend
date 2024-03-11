import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Textarea, VStack } from '@navikt/ds-react';

import { BegrunnelseRegel, Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    vurdering: Vurdering;
    regel: Regel;
    onChange: (tekst: string) => void;
}

const BegrunnelseContainer = styled(VStack)`
    width: 250px;
`;

const Begrunnelse: FC<Props> = ({ vurdering, onChange, regel }) => {
    const typeBegrunnelse = vurdering.svar && regel.svarMapping[vurdering.svar].begrunnelseType;
    const skjulBegrunnelse = typeBegrunnelse === BegrunnelseRegel.UTEN;

    if (skjulBegrunnelse) {
        return null;
    }

    const begrunnelsestekst = 'Begrunnelse '.concat(
        typeBegrunnelse !== BegrunnelseRegel.PÅKREVD ? '(valgfri)' : '(obligatorisk)'
    );

    return (
        <BegrunnelseContainer>
            <Textarea
                label={begrunnelsestekst}
                resize
                size="small"
                minRows={3}
                value={vurdering.begrunnelse}
                onChange={(e) => onChange(e.target.value)}
            />
        </BegrunnelseContainer>
    );
};
export default Begrunnelse;
