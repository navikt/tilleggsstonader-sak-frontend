import React from 'react';

import { automatiskVurdert } from './automatiskVurdert';
import { PassBarnLesMer } from './PassBarnLesMer';
import { InlineKopiknapp } from '../../../../komponenter/Knapper/InlineKopiknapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Regler } from '../../../../typer/regel';
import {
    lenkerForskriftPassBarn,
    lenkerParagrafPassBarn,
    lenkerRundskrivPassBarn,
} from '../../lenker';
import { Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import { NyttVilkår } from '../../Vilkårvurdering/NyttVilkår';
import { lagTomtDelvilkårsett } from '../../Vilkårvurdering/utils';
import { VisEllerEndreVilkår } from '../../Vilkårvurdering/VisEllerEndreVilkår';

interface Props {
    vilkårsregler: Regler;
    vilkårsvurdering: Vilkårsvurdering;
}

const PassBarn: React.FC<Props> = ({ vilkårsregler, vilkårsvurdering }) => {
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === Inngangsvilkårtype.PASS_BARN
    );

    if (vilkårsvurdering.grunnlag['@type'] !== Stønadstype.BARNETILSYN) {
        return <>Feil faktatype for pass av barn</>;
    }
    return vilkårsvurdering.grunnlag.barn.map((barn) => {
        const vilkårForDetteBarnet = vilkårsett.filter((e) => e.barnId === barn.barnId);

        const { navn, alder } = barn.registergrunnlag || '-';

        return (
            <VilkårPanel
                tittel={`${navn} (${alder} år)`}
                ekstraHeading={
                    <InlineKopiknapp kopitekst={barn.ident} tooltipTekst="Kopier fødselsnummer" />
                }
                paragraflenker={lenkerParagrafPassBarn}
                rundskrivlenke={lenkerRundskrivPassBarn}
                forskriftlenker={lenkerForskriftPassBarn}
                key={barn.barnId}
            >
                <PassBarnLesMer />
                {vilkårForDetteBarnet.map((vilkår) => (
                    <VisEllerEndreVilkår key={vilkår.id} regler={vilkårsregler} vilkår={vilkår} />
                ))}
                <NyttVilkår
                    vilkårtype={Inngangsvilkårtype.PASS_BARN}
                    vilkårsregler={vilkårsregler}
                    barnId={barn.barnId}
                    lagTomtDelvilkårsett={() =>
                        lagTomtDelvilkårsett(vilkårsregler, (regelId) =>
                            automatiskVurdert(regelId, barn.vilkårFakta)
                        )
                    }
                />
            </VilkårPanel>
        );
    });
};

export default PassBarn;
