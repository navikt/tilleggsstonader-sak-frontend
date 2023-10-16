import React, { FC, useState } from 'react';

import styled from 'styled-components';

import Begrunnelse from './Begrunnelse';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    hentSvarsalternativ,
    kanHaBegrunnelse,
    kopierBegrunnelse,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from './utils';
import VurderDelvilkår from './VurderDelvilkår';
import { BegrunnelseRegel, Regler, Svarsalternativ } from '../../../typer/regel';
import { Delvilkår, SvarPåVilkårsvurdering, Vilkår, Vilkårtype, Vurdering } from '../vilkår';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const EndreVurderingComponent: FC<{
    vilkårType: Vilkårtype;
    regler: Regler;
    oppdaterVurdering: (vurdering: SvarPåVilkårsvurdering) => void;
    vilkår: Vilkår;
}> = ({ regler, oppdaterVurdering, vilkår }) => {
    const [delvikårsett, settDelvilkårsett] = useState<Delvilkår[]>(vilkår.delvilkårsett);

    const oppdaterVilkårsvar = (index: number, nySvarArray: Vurdering[]) => {
        settDelvilkårsett((prevSvar) => {
            const prevDelvilkårsett = prevSvar[index];
            return [
                ...prevSvar.slice(0, index),
                {
                    ...prevDelvilkårsett,
                    vurderinger: nySvarArray,
                },
                ...prevSvar.slice(index + 1),
            ];
        });
    };

    const oppdaterBegrunnelse = (
        vurderinger: Vurdering[],
        delvilkårIndex: number,
        nyttSvar: Vurdering
    ) => {
        const { begrunnelse } = nyttSvar;
        const svarsalternativ: Svarsalternativ | undefined = hentSvarsalternativ(regler, nyttSvar);
        if (!svarsalternativ) {
            return;
        }

        const oppdaterteSvar = oppdaterSvarIListe(nyttSvar, vurderinger, true);

        const oppdaterteSvarMedNesteRegel = leggTilNesteIdHvis(
            svarsalternativ.regelId,
            oppdaterteSvar,
            () => begrunnelseErPåkrevdOgUtfyllt(svarsalternativ, begrunnelse)
        );
        oppdaterVilkårsvar(delvilkårIndex, oppdaterteSvarMedNesteRegel);
        // settIkkePersistertKomponent(vurdering.id);
    };

    const oppdaterSvar = (
        vurderinger: Vurdering[],
        delvilkårIndex: number,
        nyttSvar: Vurdering
    ) => {
        const svarsalternativer: Svarsalternativ | undefined = hentSvarsalternativ(
            regler,
            nyttSvar
        );

        if (!svarsalternativer) {
            return;
        }

        const oppdaterteSvar = oppdaterSvarIListe(
            nyttSvar,
            vurderinger,
            false,
            kanHaBegrunnelse(svarsalternativer)
        );

        const oppdaterteSvarMedNesteRegel = leggTilNesteIdHvis(
            svarsalternativer.regelId,
            oppdaterteSvar,
            () => svarsalternativer.begrunnelseType !== BegrunnelseRegel.PÅKREVD
        );

        const oppdaterteSvarMedKopiertBegrunnelse = kopierBegrunnelse(
            vurderinger,
            oppdaterteSvarMedNesteRegel,
            nyttSvar,
            svarsalternativer,
            regler
        );

        oppdaterVilkårsvar(delvilkårIndex, oppdaterteSvarMedKopiertBegrunnelse);
        // settIkkePersistertKomponent(vurdering.id);
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                oppdaterVurdering({
                    id: vilkår.id,
                    behandlingId: vilkår.behandlingId,
                    delvilkårsett: delvikårsett,
                });
            }}
        >
            <Container>
                {delvikårsett.map((delvikår, delvikårIndex) => {
                    return delvikår.vurderinger.map((svar) => {
                        const regel = regler[svar.regelId];
                        return (
                            <React.Fragment key={regel.regelId}>
                                <VurderDelvilkår
                                    vurdering={svar}
                                    regel={regel}
                                    settVurdering={(nyVurdering) =>
                                        oppdaterSvar(
                                            delvikår.vurderinger,
                                            delvikårIndex,
                                            nyVurdering
                                        )
                                    }
                                />
                                <Begrunnelse
                                    onChange={(begrunnelse) =>
                                        oppdaterBegrunnelse(delvikår.vurderinger, delvikårIndex, {
                                            ...svar,
                                            begrunnelse,
                                        })
                                    }
                                    svar={svar}
                                    regel={regel}
                                />
                            </React.Fragment>
                        );
                    });
                })}
            </Container>
        </form>
    );
};
export default EndreVurderingComponent;
