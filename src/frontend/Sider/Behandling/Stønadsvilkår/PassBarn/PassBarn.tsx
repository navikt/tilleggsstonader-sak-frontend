import React from 'react';

import { Heading, HStack } from '@navikt/ds-react';

import EkspanderbartPanel from '../../../../komponenter/EkspanderbartPanel/EkspanderbartPanel';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ParagrafOgRundskrivLenker } from '../../../../komponenter/ParagrafOgRundskrivLenker';
import { Vilkårsregler } from '../../../../typer/regel';
import { lovverkslenkerAktivitet, rundskrivPassBarn } from '../../lenker';
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

        return (
            <EkspanderbartPanel
                heading={
                    <>
                        <HStack gap="2">
                            <VilkårsresultatIkon vilkårsresultat={vilkår.resultat} />
                            <Heading size="small">{barnetsNavn}</Heading>
                        </HStack>
                        <ParagrafOgRundskrivLenker
                            paragrafLenker={lovverkslenkerAktivitet}
                            rundskrivLenke={rundskrivPassBarn}
                        />
                    </>
                }
            >
                <VisEllerEndreVilkår vilkår={vilkår} regler={vilkårsregler.regler} />
            </EkspanderbartPanel>
        );
    });
};

export default PassBarn;
