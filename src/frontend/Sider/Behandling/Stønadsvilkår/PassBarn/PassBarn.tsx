import React from 'react';

import { useVilkår } from '../../../../context/VilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { InlineKopiknapp } from '../../../../komponenter/Knapper/InlineKopiknapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Regler } from '../../../../typer/regel';
import {
    lenkerForskriftPassBarn,
    lenkerParagrafPassBarn,
    lenkerRundskrivPassBarn,
} from '../../lenker';
import { Delvilkår, Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import { NyttVilkår } from '../../Vilkårvurdering/NyttVilkår';
import { VisEllerEndreVilkår } from '../../Vilkårvurdering/VisEllerEndreVilkår';

interface Props {
    vilkårsregler: Regler;
    vilkårsvurdering: Vilkårsvurdering;
}

const PassBarn: React.FC<Props> = ({ vilkårsregler, vilkårsvurdering }) => {
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === Inngangsvilkårtype.PASS_BARN
    );

    const { lagreVilkår } = useVilkår();

    return vilkårsvurdering.grunnlag.barn.map((barn) => {
        const vilkårForDetteBarnet = vilkårsett.filter((e) => e.barnId === barn.barnId);

        const { navn, alder } = barn.registergrunnlag || '-';

        return (
            <VilkårPanel
                tittel={`${navn} (${alder} år)`}
                ikon={<VilkårsresultatIkon vilkårsresultat={vilkårForDetteBarnet[0].resultat} />} // TODO: Dette ikonet skal på sikt fjernes, vi skal i stedet vise ett resultat per vilkår, ikke et per barn.
                ekstraHeading={
                    <InlineKopiknapp kopitekst={barn.ident} tooltipTekst="Kopier fødselsnummer" />
                }
                paragraflenker={lenkerParagrafPassBarn}
                rundskrivlenke={lenkerRundskrivPassBarn}
                forskriftlenker={lenkerForskriftPassBarn}
                key={barn.barnId}
            >
                {vilkårForDetteBarnet.map((vilkår) => (
                    <VisEllerEndreVilkår
                        key={vilkår.id}
                        regler={vilkårsregler}
                        resultat={vilkår.resultat}
                        lagretDelvilkårsett={vilkår.delvilkårsett}
                        lagreVurdering={(vurderinger: Delvilkår[]) =>
                            lagreVilkår({
                                id: vilkår.id,
                                behandlingId: vilkår.behandlingId,
                                delvilkårsett: vurderinger,
                            })
                        }
                    />
                ))}
                <NyttVilkår
                    vilkårtype={Inngangsvilkårtype.PASS_BARN}
                    vilkårsregler={vilkårsregler}
                    barnId={barn.barnId}
                />
            </VilkårPanel>
        );
    });
};

export default PassBarn;
