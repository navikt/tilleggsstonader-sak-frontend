import React from 'react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { InlineKopiknapp } from '../../../../komponenter/InlineKopiknapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { paragraflenkerPassBarn, rundskrivPassBarn } from '../../lenker';
import { Vilkårstype, Vilkårsvurdering } from '../../vilkår';
import VisEllerEndreVilkår from '../../Vilkårvurdering/VisEllerEndreVilkår';

interface Props {
    vilkårsvurderinger: Vilkårsvurdering;
}

const PassBarn: React.FC<Props> = ({ vilkårsvurderinger }) => {
    const vilkårsettPassBarn = vilkårsvurderinger.vilkårsett.filter(
        (vilkår) => vilkår.vilkårType === Vilkårstype.PASS_BARN
    );

    if (vilkårsettPassBarn.length === 0) {
        return <div>Mangler vurderinger for pass av barn</div>;
    }

    const finnBarnIGrunnlag = (barnId: string) =>
        vilkårsvurderinger.grunnlag.barn.find((barn) => barn.barnId === barnId);

    return vilkårsettPassBarn.map((vilkårPerBarn) => {
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
                <VisEllerEndreVilkår vilkår={vilkårPerBarn} />
            </VilkårPanel>
        );
    });
};

export default PassBarn;
