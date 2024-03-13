import React from 'react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { InlineKopiknapp } from '../../../../komponenter/InlineKopiknapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Vilkårsregler } from '../../../../typer/regel';
import { paragraflenkerPassBarn, rundskrivPassBarn } from '../../lenker';
import { Inngangsvilkårtype, Vilkårssett } from '../../vilkår';
import VisEllerEndreVilkår from '../../Vilkårvurdering/VisEllerEndreVilkår';

interface Props {
    vilkårsregler: Vilkårsregler<Inngangsvilkårtype.PASS_BARN>;
    vilkårsvurdering: Vilkårssett;
}

const PassBarn: React.FC<Props> = ({ vilkårsregler, vilkårsvurdering }) => {
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === Inngangsvilkårtype.PASS_BARN
    );

    if (vilkårsett.length === 0) {
        return <div>Mangler vurderinger for pass av barn</div>;
    }

    const finnBarnIGrunnlag = (barnId: string) =>
        vilkårsvurdering.grunnlag.barn.find((barn) => barn.barnId === barnId);

    return vilkårsett.map((vilkårPerBarn) => {
        if (!vilkårPerBarn.barnId) {
            return <div>Vilkår er ikke knyttet til et barn</div>;
        }

        const grunnlagBarn = finnBarnIGrunnlag(vilkårPerBarn.barnId);

        if (!grunnlagBarn) {
            return <div>Fant ikke grunnlag for barn</div>;
        }

        const barnetsNavn = grunnlagBarn.registergrunnlag.navn;
        const barnetsAlder = grunnlagBarn.registergrunnlag.alder || '-';

        return (
            <VilkårPanel
                tittel={`${barnetsNavn} (${barnetsAlder} år)`}
                ikon={<VilkårsresultatIkon vilkårsresultat={vilkårPerBarn.resultat} />}
                ekstraHeading={
                    <InlineKopiknapp
                        kopitekst={grunnlagBarn.ident}
                        tooltipTekst="Kopier fødselsnummer"
                    />
                }
                paragraflenker={paragraflenkerPassBarn}
                rundskrivlenke={rundskrivPassBarn}
                key={grunnlagBarn.barnId}
            >
                <VisEllerEndreVilkår vilkår={vilkårPerBarn} regler={vilkårsregler.regler} />
            </VilkårPanel>
        );
    });
};

export default PassBarn;
