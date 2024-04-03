import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Textarea, VStack } from '@navikt/ds-react';

import { BegrunnelseRegel, Regel } from '../../../typer/regel';
import { harIkkeVerdi } from '../../../utils/utils';
import { Vurdering } from '../vilkår';

interface Props {
    vurdering: Vurdering;
    regel: Regel;
    oppdaterBegrunnelse: (tekst: string) => void;
}

const BegrunnelseContainer = styled(VStack)`
    width: 250px;
`;

const Begrunnelse: FC<Props> = ({ vurdering, oppdaterBegrunnelse, regel }) => {
    const typeBegrunnelse = vurdering.svar && regel.svarMapping[vurdering.svar].begrunnelseType;
    const skjulBegrunnelse = typeBegrunnelse === BegrunnelseRegel.UTEN;

    if (skjulBegrunnelse) {
        return null;
    }

    const erDeaktivert = harIkkeVerdi(vurdering.svar);

    const begrunnelsestekst = 'Begrunnelse '.concat(
        erDeaktivert
            ? ''
            : typeBegrunnelse !== BegrunnelseRegel.PÅKREVD
              ? '(valgfri)'
              : '(obligatorisk)'
    );

    return (
        <BegrunnelseContainer>
            <Textarea
                label={begrunnelsestekst}
                resize
                size="small"
                minRows={3}
                value={vurdering.begrunnelse || ''}
                onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                disabled={harIkkeVerdi(vurdering.svar)}
            />
        </BegrunnelseContainer>
    );
};
export default Begrunnelse;
