import React, { FC } from 'react';

import { Radio, RadioGroup, ReadMore, Textarea } from '@navikt/ds-react';

import styles from './FellesDelvilkår.module.css';
import { svarIdTilTekst } from './tekster';
import { lagBegrunnelsestekst } from './utils';
import { BegrunnelseRegel, SvarId } from '../../../typer/regel';

export interface DelvilkårSvaralternativ {
    svarId: SvarId;
    begrunnelseType: BegrunnelseRegel;
}

interface Props {
    regelId: string;
    label: string;
    svaralternativer: DelvilkårSvaralternativ[];
    svar?: SvarId;
    begrunnelse?: string | null;
    oppdaterSvar: (svar: SvarId) => void;
    oppdaterBegrunnelse: (begrunnelse: string) => void;
    feilmeldingSvar?: string;
    feilmeldingBegrunnelse?: string;
    hjelpetekstHeader?: React.ReactNode;
    hjelpetekst?: React.ReactNode;
    hjelpetekstKort?: string;
    beskrivelse?: React.ReactNode;
    begrunnelseHjelpetekst?: string;
    erUndervilkår?: boolean;
    children?: React.ReactNode;
}

export const FellesDelvilkår: FC<Props> = ({
    regelId,
    label,
    svaralternativer,
    svar,
    begrunnelse,
    oppdaterSvar,
    oppdaterBegrunnelse,
    feilmeldingSvar,
    feilmeldingBegrunnelse,
    hjelpetekstHeader,
    hjelpetekst,
    hjelpetekstKort,
    beskrivelse,
    begrunnelseHjelpetekst,
    erUndervilkår = false,
    children,
}) => {
    const valgtSvaralternativ = svaralternativer.find((alternativ) => alternativ.svarId === svar);
    const begrunnelseType = valgtSvaralternativ?.begrunnelseType ?? BegrunnelseRegel.UTEN;

    return (
        <div
            className={`${styles.container} ${erUndervilkår ? styles.containerUndervilkar : ''}`.trim()}
        >
            <RadioGroup
                legend={label}
                description={beskrivelse ?? hjelpetekstKort}
                value={svar ?? ''}
                size="small"
                error={feilmeldingSvar}
                onChange={oppdaterSvar}
            >
                {hjelpetekst && (
                    <ReadMore
                        className={styles.containerHjelpetekst}
                        header={hjelpetekstHeader ?? 'Slik gjør du vurderingen'}
                        size="small"
                    >
                        {hjelpetekst}
                    </ReadMore>
                )}
                {svaralternativer.map((alternativ) => (
                    <Radio
                        key={`${regelId}_${alternativ.svarId}`}
                        name={regelId}
                        value={alternativ.svarId}
                    >
                        {svarIdTilTekst[alternativ.svarId] || alternativ.svarId}
                    </Radio>
                ))}
            </RadioGroup>
            {begrunnelseType !== BegrunnelseRegel.UTEN && (
                <Textarea
                    label={lagBegrunnelsestekst(begrunnelseType)}
                    resize
                    size="small"
                    error={feilmeldingBegrunnelse}
                    minRows={3}
                    value={begrunnelse ?? ''}
                    onChange={(event) => oppdaterBegrunnelse(event.target.value)}
                    description={begrunnelseHjelpetekst}
                />
            )}
            {children}
        </div>
    );
};
