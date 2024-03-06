import React from 'react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import Panel from '../../../../komponenter/Panel/Panel';
import { ParagrafOgRundskrivLenker } from '../../../../komponenter/ParagrafOgRundskrivLenker';
import { VerdiMedKopiknapp } from '../../../../komponenter/VerdiMedKopiknapp';
import { Vilkårsregler } from '../../../../typer/regel';
import { lovverkslenkerPassBarn, rundskrivPassBarn } from '../../lenker';
import { Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import VisEllerEndreVilkår from '../../Vilkårvurdering/VisEllerEndreVilkår';

interface Props {
    vilkårsregler: Vilkårsregler<Inngangsvilkårtype.PASS_BARN>;
    vilkårsvurdering: Vilkårsvurdering;
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

    return vilkårsett.map((vilkår) => {
        if (!vilkår.barnId) {
            return <div>Vilkår er ikke knyttet til et barn</div>;
        }

        const grunnlagBarn = finnBarnIGrunnlag(vilkår.barnId);

        if (!grunnlagBarn) {
            return <div>Fant ikke grunnlag for barn</div>;
        }

        const barnetsNavn = grunnlagBarn.registergrunnlag.navn;
        const barnetsAlder = grunnlagBarn.registergrunnlag.alder || '-';

        return (
            <Panel
                tittel={`${barnetsNavn} (${barnetsAlder} år)`}
                ikon={<VilkårsresultatIkon vilkårsresultat={vilkår.resultat} />}
                key={grunnlagBarn.barnId}
                ekstraHeading={
                    <>
                        <VerdiMedKopiknapp verdi={grunnlagBarn.ident} />
                        <ParagrafOgRundskrivLenker
                            paragrafLenker={lovverkslenkerPassBarn}
                            rundskrivLenke={rundskrivPassBarn}
                        />
                    </>
                }
            >
                <VisEllerEndreVilkår vilkår={vilkår} regler={vilkårsregler.regler} />
            </Panel>
        );
    });
};

export default PassBarn;
