import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    hentSvaralternativ,
    kanHaBegrunnelse,
    kopierBegrunnelse,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from './utils';
import { Feilmeldinger, validerVilkårsvurderinger } from './validering';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../typer/regel';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { Delvilkår, SvarPåVilkår, Vilkår, Vilkårtype, Vurdering } from '../vilkår';

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
`;

const DelvilkårContainer = styled.div<{ $erUndervilkår: boolean }>`
    border-left: ${({ $erUndervilkår }) =>
        $erUndervilkår ? `5px solid ${ABorderAction}` : 'none'};
    padding-left: ${({ $erUndervilkår }) => ($erUndervilkår ? '1rem' : '0')};
    gap: ${({ $erUndervilkår }) => ($erUndervilkår ? `5rem` : `6rem`)};
    display: flex;

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const EndreDelvilkår: FC<{
    vilkårType: Vilkårtype;
    regler: Regler;
    oppdaterVilkår: (svarPåVilkår: SvarPåVilkår) => void;
    vilkår: Vilkår;
}> = ({ regler, oppdaterVilkår, vilkår }) => {
    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(vilkår.delvilkårsett);
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
    };

    const oppdaterSvar = (
        vurderinger: Vurdering[],
        delvilkårIndex: number,
        nyttSvar: Vurdering
    ) => {
        const svaralternativer: Svaralternativ | undefined = hentSvaralternativ(regler, nyttSvar);

        if (!svaralternativer) {
            return;
        }

        const oppdaterteSvar = oppdaterSvarIListe(
            nyttSvar,
            vurderinger,
            false,
            kanHaBegrunnelse(svaralternativer)
        );

        const oppdaterteSvarMedNesteRegel = leggTilNesteIdHvis(
            svaralternativer.regelId,
            oppdaterteSvar,
            () => svaralternativer.begrunnelseType !== BegrunnelseRegel.PÅKREVD
        );

        const oppdaterteSvarMedKopiertBegrunnelse = kopierBegrunnelse(
            vurderinger,
            oppdaterteSvarMedNesteRegel,
            nyttSvar,
            svaralternativer,
            regler
        );

        oppdaterVilkårsvar(delvilkårIndex, oppdaterteSvarMedKopiertBegrunnelse);
        // settIkkePersistertKomponent(vurdering.id);
    };

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const validerOgLagreVilkårsvurderinger = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurderinger(delvilkårsett, regler);

        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            oppdaterVilkår({
                id: vilkår.id,
                behandlingId: vilkår.behandlingId,
                delvilkårsett: delvilkårsett,
            });
        }
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurderinger}>
            <VStack gap="4">
                {delvilkårsett.map((delvikår, delvilkårIndex) => {
                    return delvikår.vurderinger.map((svar, indeks) => {
                        const gjeldendeRegel = regler[svar.regelId];
                        const erUndervilkår = indeks !== 0;
                        return (
                            <React.Fragment key={gjeldendeRegel.regelId + vilkår.barnId}>
                                {delvilkårIndex !== 0 && !erUndervilkår && <Skillelinje />}
                                <DelvilkårContainer $erUndervilkår={erUndervilkår}>
                                    <DelvilkårRadioknapper
                                        vurdering={svar}
                                        regel={gjeldendeRegel}
                                        settVurdering={(nyVurdering) =>
                                            oppdaterSvar(
                                                delvikår.vurderinger,
                                                delvilkårIndex,
                                                nyVurdering
                                            )
                                        }
                                        feilmelding={feilmeldinger[gjeldendeRegel.regelId]}
                                        nullstillFeilmelding={nullstillFeilmelding}
                                    />
                                    <Begrunnelse
                                        onChange={(begrunnelse) =>
                                            oppdaterBegrunnelse(
                                                delvikår.vurderinger,
                                                delvilkårIndex,
                                                {
                                                    ...svar,
                                                    begrunnelse,
                                                }
                                            )
                                        }
                                        vurdering={svar}
                                        regel={gjeldendeRegel}
                                    />
                                </DelvilkårContainer>
                            </React.Fragment>
                        );
                    });
                })}
                <HStack gap="1">
                    <Skillelinje />
                    <LagreKnapp size={'small'} style={{ maxWidth: 'fit-content' }}>
                        Lagre
                    </LagreKnapp>
                </HStack>
            </VStack>
        </form>
    );
};
export default EndreDelvilkår;
