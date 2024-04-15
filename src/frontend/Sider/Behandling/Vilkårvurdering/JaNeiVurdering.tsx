import React from 'react';

import { Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { harVerdi } from '../../../utils/utils';
import {
    SvarJaNei,
    Vurdering,
    svarJaNeiMapping,
    BegrunnelseObligatorisk,
} from '../Inngangsvilkår/typer/vilkårperiode';

const JaNeiVurdering: React.FC<{
    label: string;
    vurdering?: Vurdering;
    oppdaterVurdering: (vurdering: Vurdering) => void;
    svarJa?: string;
    svarNei?: string;
    begrunnelsePåkrevd?: BegrunnelseObligatorisk;
}> = ({
    vurdering,
    oppdaterVurdering,
    label,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
    begrunnelsePåkrevd,
}) => {
    const begunnelseLabel = (påkrevd?: BegrunnelseObligatorisk, svar?: SvarJaNei): string => {
        switch (påkrevd) {
            case BegrunnelseObligatorisk.OBLIGATORISK:
                return 'Begrunnelse (obligatorisk)';
            case BegrunnelseObligatorisk.OBLIGATORISK_HVIS_SVAR_NEI:
                return svar === SvarJaNei.NEI
                    ? 'Begrunnelse (obligatorisk)'
                    : 'Begrunnelse (valgfri)';
            case BegrunnelseObligatorisk.OBLIGATORISK_HVIS_SVAR_JA:
                return svar === SvarJaNei.JA
                    ? 'Begrunnelse (obligatorisk)'
                    : 'Begrunnelse (valgfri)';
            case BegrunnelseObligatorisk.VALGFRI:
            default:
                return 'Begrunnelse (valgfri)';
        }
    };

    const oppdaterBegrunnelse = (nyBegrunnelse: string) => {
        oppdaterVurdering({
            ...vurdering,
            begrunnelse: harVerdi(nyBegrunnelse) ? nyBegrunnelse : undefined,
        });
    };

    return (
        <>
            <RadioGroup
                value={vurdering?.svar || ''}
                legend={label}
                onChange={(e) => oppdaterVurdering({ ...vurdering, svar: e })}
                size="small"
            >
                <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
            </RadioGroup>
            <Textarea
                value={vurdering?.begrunnelse || ''}
                onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                label={begunnelseLabel(begrunnelsePåkrevd, vurdering?.svar)}
                size="small"
            />
        </>
    );
};

export default JaNeiVurdering;
