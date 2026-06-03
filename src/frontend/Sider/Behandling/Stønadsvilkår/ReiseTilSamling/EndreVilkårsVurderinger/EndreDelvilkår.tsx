import * as React from 'react';
import { FC } from 'react';

import { Radio, RadioGroup, ReadMore, Textarea } from '@navikt/ds-react';

import styles from './EndreDelvilkår.module.css';
import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';
import { svarIdTilTekst } from '../../../Vilkårvurdering/tekster';
import { lagBegrunnelsestekst } from '../../../Vilkårvurdering/utils';
import { finnBegrunnelsestypeForSvar } from '../EndreVilkår/utils';
import { FeilmeldingerReiseTilSamling } from '../EndreVilkår/validering';
import { RegelIdReiseTilSamling, SvarAlternativ } from '../typer/regelstrukturReiseTilSamling';
import { SvarOgBegrunnelse } from '../typer/vilkårReiseTilSamling';

interface Props {
    regelId: RegelIdReiseTilSamling;
    svaralternativer: SvarAlternativ[];
    vurdering: SvarOgBegrunnelse | undefined;
    oppdaterVurdering: (regelId: RegelIdReiseTilSamling, vurdering: SvarOgBegrunnelse) => void;
    oppdaterBegrunnelseIVurdering: (
        regelId: RegelIdReiseTilSamling,
        svarId: SvarId,
        nyBegrunnelse: string
    ) => void;
    erUndervilkår?: boolean;
    label: string;
    hjelpetekstHeader?: React.ReactNode;
    hjelpetekst?: React.ReactNode;
    feilmeldinger: FeilmeldingerReiseTilSamling;
    begrunnelseHjelpetekst?: string;
}

export const EndreDelvilkår: FC<Props> = ({
    vurdering,
    oppdaterVurdering,
    oppdaterBegrunnelseIVurdering,
    regelId,
    svaralternativer,
    label,
    hjelpetekstHeader,
    hjelpetekst,
    feilmeldinger,
    erUndervilkår = false,
    begrunnelseHjelpetekst,
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
        <div
            className={`${styles.container} ${erUndervilkår ? styles.containerUndervilkar : ''}`.trim()}
        >
            <RadioGroup legend={label} value={vurdering?.svar} size="small" onChange={oppdaterSvar}>
                {hjelpetekst && (
                    <ReadMore
                        className={styles.containerHjelpetekst}
                        header={hjelpetekstHeader ?? 'Slik gjør du vurderingen'}
                        size={'small'}
                    >
                        {hjelpetekst}
                    </ReadMore>
                )}
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
                    error={feilmeldinger.begrunnelse?.[regelId]}
                    minRows={3}
                    value={vurdering?.begrunnelse || ''}
                    onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                    description={begrunnelseHjelpetekst}
                />
            )}
        </div>
    );
};
