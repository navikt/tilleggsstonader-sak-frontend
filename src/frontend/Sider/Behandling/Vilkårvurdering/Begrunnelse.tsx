import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Textarea } from '@navikt/ds-react';

import { BegrunnelseRegel, Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    vurdering: Vurdering;
    regel: Regel;
    onChange: (tekst: string) => void;
}

const FixedWidthTextarea = styled(Textarea)`
    display: flex;
    flex-direction: column;
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
        <FixedWidthTextarea
            label={begrunnelsestekst}
            resize
            size="small"
            minRows={3}
            value={vurdering.begrunnelse || ''}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};
export default Begrunnelse;
