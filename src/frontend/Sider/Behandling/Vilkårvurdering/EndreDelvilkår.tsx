import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    erAlleDelvilkårBesvarte,
    hentSvaralternativ,
    kanHaBegrunnelse,
    kopierBegrunnelse,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from './utils';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../typer/regel';
import { Delvilkår, SvarPåVilkår, Vilkår, Vilkårtype, Vurdering } from '../vilkår';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
`;

const DelvilkårContainer = styled.div<{ $erUndervilkår: boolean }>`
    border-left: ${({ $erUndervilkår }) =>
        $erUndervilkår ? `5px solid ${ABorderAction}` : 'none'};
    padding-left: ${({ $erUndervilkår }) => ($erUndervilkår ? '11px' : '0')};
    margin-top: ${({ $erUndervilkår }) => ($erUndervilkår ? '0' : '16px')};
    gap: ${({ $erUndervilkår }) => ($erUndervilkår ? `32px` : `48px`)};
    display: flex;

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 0;
    }
`;

const EndreDelvilkår: FC<{
    vilkårType: Vilkårtype;
    regler: Regler;
    oppdaterVilkår: (svarPåVilkår: SvarPåVilkår) => void;
    vilkår: Vilkår;
}> = ({ regler, oppdaterVilkår, vilkår }) => {
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
        const svarsalternativ: Svaralternativ | undefined = hentSvaralternativ(regler, nyttSvar);
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
        const svarsalternativer: Svaralternativ | undefined = hentSvaralternativ(regler, nyttSvar);

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

    const skalViseLagreKnapp = erAlleDelvilkårBesvarte(delvikårsett, regler);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        oppdaterVilkår({
            id: vilkår.id,
            behandlingId: vilkår.behandlingId,
            delvilkårsett: delvikårsett,
        });
        // nullstillIkkePersistertKomponent(vurdering.id);
        //settPanelITilstand(vurdering.vilkårType, EkspandertTilstand.EKSPANDERT);
    };

    return (
        <form onSubmit={onSubmit}>
            <Container>
                {delvikårsett.map((delvikår, delvikårIndex) => {
                    return delvikår.vurderinger.map((svar, indeks) => {
                        const regel = regler[svar.regelId];
                        return (
                            <DelvilkårContainer $erUndervilkår={indeks !== 0} key={regel.regelId}>
                                <DelvilkårRadioknapper
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
                            </DelvilkårContainer>
                        );
                    });
                })}
            </Container>
            {skalViseLagreKnapp && <LagreKnapp size={'small'}>Lagre</LagreKnapp>}
        </form>
    );
};
export default EndreDelvilkår;
