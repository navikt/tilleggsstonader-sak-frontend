import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { BorderAccent } from '@navikt/ds-tokens/darkside-js';

import { BegrunnelseRegel, SvarId } from '../../../../../../typer/regel';
import { svarIdTilTekst } from '../../../../Vilkårvurdering/tekster';
import { lagBegrunnelsestekst } from '../../../../Vilkårvurdering/utils';
import { RegelIdDagligReise, SvarAlternativ } from '../../typer/regelstrukturDagligReise';
import { SvarOgBegrunnelse } from '../../typer/vilkårDagligReise';
import { finnBegrunnelsestypeForSvar } from '../utils';

interface Props {
    regelId: RegelIdDagligReise;
    svaralternativer: SvarAlternativ[];
    vurdering: SvarOgBegrunnelse | undefined;
    oppdaterVurdering: (regelId: RegelIdDagligReise, vurdering: SvarOgBegrunnelse) => void;
    oppdaterBegrunnelseIVurdering: (
        regelId: RegelIdDagligReise,
        svarId: SvarId,
        nyBegrunnelse: string
    ) => void;
    erUndervilkår?: boolean;
    label: string;
    hjelpetekst?: string;
}

const Container = styled.div<{ $erUndervilkår: boolean }>`
    display: grid;
    grid-template-columns: minmax(auto, 350px) auto;

    border-left: ${({ $erUndervilkår }) => ($erUndervilkår ? `5px solid ${BorderAccent}` : 'none')};
    padding-left: ${({ $erUndervilkår }) => ($erUndervilkår ? '1rem' : '0')};
    gap: ${({ $erUndervilkår }) => ($erUndervilkår ? `3rem` : `4rem`)};

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

export const EndreDelvilkår: FC<Props> = ({
    vurdering,
    oppdaterVurdering,
    oppdaterBegrunnelseIVurdering,
    regelId,
    svaralternativer,
    label,
    hjelpetekst,
    erUndervilkår = false,
}) => {
    const [begrunnelseType, settBegrunnelseType] = React.useState<BegrunnelseRegel>(
        finnBegrunnelsestypeForSvar(svaralternativer, vurdering?.svar)
    );

    const oppdaterSvar = (nyttSvar: SvarId) => {
        const begrunnelseTypeForSvar = finnBegrunnelsestypeForSvar(svaralternativer, nyttSvar);
        const skalHaBegrunnelse = begrunnelseTypeForSvar !== BegrunnelseRegel.UTEN;

        oppdaterVurdering(regelId, {
            svar: nyttSvar,
            begrunnelse: skalHaBegrunnelse ? vurdering?.begrunnelse : undefined,
        });

        settBegrunnelseType(begrunnelseTypeForSvar);
    };

    const oppdaterBegrunnelse = (nyBegrunnelse: string) => {
        // Begrunnelse er ikke et synlig felt før delvilkår er besvart
        if (vurdering?.svar) {
            oppdaterBegrunnelseIVurdering(regelId, vurdering.svar, nyBegrunnelse);
        }
    };

    const begrunnelseLabel = lagBegrunnelsestekst(begrunnelseType);

    return (
        <Container $erUndervilkår={erUndervilkår}>
            <RadioGroup
                legend={label}
                description={hjelpetekst}
                value={vurdering?.svar}
                size="small"
                onChange={oppdaterSvar}
            >
                {svaralternativer.map((svar) => {
                    return (
                        <Radio
                            key={`${regelId}_${svar.svarId}`}
                            name={`${regelId}_${svar}`}
                            value={svar.svarId}
                        >
                            {svarIdTilTekst[svar.svarId] || svar.svarId}
                        </Radio>
                    );
                })}
            </RadioGroup>
            {begrunnelseType !== BegrunnelseRegel.UTEN && (
                <Textarea
                    label={begrunnelseLabel}
                    resize
                    size="small"
                    minRows={3}
                    value={vurdering?.begrunnelse || ''}
                    onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                />
            )}
        </Container>
    );
};
