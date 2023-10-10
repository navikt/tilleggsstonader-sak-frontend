import * as React from 'react';
import { FC } from 'react';

import { Textarea } from '@navikt/ds-react';

import { BegrunnelseRegel, Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    svar: Vurdering;
    regel: Regel;
    onChange: (tekst: string) => void;
}

const Begrunnelse: FC<Props> = ({ svar, onChange, regel }) => {
    const begrunnelseType = svar.svar && regel.svarMapping[svar.svar].begrunnelseType;
    const skjulBegrunnelse = (begrunnelseType ?? BegrunnelseRegel.UTEN) === BegrunnelseRegel.UTEN;

    if (skjulBegrunnelse) {
        return null;
    }

    return (
        <Textarea
            label={'Begrunnelse '.concat(
                begrunnelseType === BegrunnelseRegel.VALGFRI ? '(hvis aktuelt)' : ''
            )}
            value={svar.begrunnelse || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={0}
        />
    );
};
export default Begrunnelse;
