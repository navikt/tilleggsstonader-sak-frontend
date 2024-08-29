import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { useVilkår } from '../../../../context/VilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { InlineKopiknapp } from '../../../../komponenter/Knapper/InlineKopiknapp';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Regler } from '../../../../typer/regel';
import { RessursStatus } from '../../../../typer/ressurs';
import {
    lenkerForskriftPassBarn,
    lenkerParagrafPassBarn,
    lenkerRundskrivPassBarn,
} from '../../lenker';
import { Delvilkår, Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import { EndreDelvilkår } from '../../Vilkårvurdering/EndreDelvilkår';
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

    const { lagreVilkår, lagreNyttVilkår } = useVilkår();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

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
                        key={barn.ident}
                        regler={vilkårsregler}
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
                {leggerTilNyttVilkår ? (
                    <EndreDelvilkår
                        regler={vilkårsregler}
                        lagretDelvilkårsett={lagTomtDelvilkårsett(vilkårsregler)}
                        avsluttRedigering={() => {}}
                        lagreVurdering={async (vurderinger: Delvilkår[]) => {
                            const response = await lagreNyttVilkår({
                                barnId: barn.barnId,
                                behandlingId: vilkårsett[0].behandlingId, // TODO: Kan behandlingId-en trekkes ut fra vilkårssettet?
                                delvilkårsett: vurderinger,
                            });
                            if (response.status === RessursStatus.SUKSESS) {
                                settLeggerTilNyttVilkår(false);
                            }
                            return response;
                        }}
                    />
                ) : (
                    <SmallButton
                        onClick={() => settLeggerTilNyttVilkår(true)}
                        variant="secondary"
                        icon={<PlusCircleIcon />}
                    >
                        Legg til ny periode
                    </SmallButton>
                )}
            </VilkårPanel>
        );
    });
};

export default PassBarn;
