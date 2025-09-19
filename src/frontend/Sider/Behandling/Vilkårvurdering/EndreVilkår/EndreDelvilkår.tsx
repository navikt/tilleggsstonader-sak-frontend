import React from 'react';

import styled from 'styled-components';

import { BorderAccent } from '@navikt/ds-tokens/darkside-js';

import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../../typer/regel';
import { Delvilkår, Vurdering } from '../../vilkår';
import Begrunnelse from '../Begrunnelse';
import DelvilkårRadioknapper from '../DelvilkårRadioknapper';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    hentSvaralternativ,
    kanHaBegrunnelse,
    kopierBegrunnelse,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from '../utils';
import { Feilmeldinger } from '../validering';

const DelvilkårContainer = styled.div<{ $erUndervilkår: boolean }>`
    border-left: ${({ $erUndervilkår }) => ($erUndervilkår ? `5px solid ${BorderAccent}` : 'none')};
    padding-left: ${({ $erUndervilkår }) => ($erUndervilkår ? '1rem' : '0')};
    gap: ${({ $erUndervilkår }) => ($erUndervilkår ? `5rem` : `6rem`)};
    display: flex;

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

interface Props {
    delvilkårsett: Delvilkår[];
    regler: Regler;
    settDetFinnesUlagredeEndringer: (value: ((prevState: boolean) => boolean) | boolean) => void;
    feilmeldinger: Feilmeldinger;
    settFeilmeldinger: (
        value: ((prevState: Feilmeldinger) => Feilmeldinger) | Feilmeldinger
    ) => void;
    settDelvilkårsett: (value: ((prevState: Delvilkår[]) => Delvilkår[]) | Delvilkår[]) => void;
}

const EndreDelvilkår: React.FC<Props> = ({
    delvilkårsett,
    regler,
    settDetFinnesUlagredeEndringer,
    feilmeldinger,
    settFeilmeldinger,
    settDelvilkårsett,
}) => {
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
        const svaralternativ: Svaralternativ | undefined = hentSvaralternativ(regler, nyttSvar);
        if (!svaralternativ) {
            return;
        }

        const oppdaterteSvar = oppdaterSvarIListe(nyttSvar, vurderinger, true);

        const oppdaterteSvarMedNesteRegel = leggTilNesteIdHvis(
            svaralternativ.regelId,
            oppdaterteSvar,
            () => begrunnelseErPåkrevdOgUtfyllt(svaralternativ, begrunnelse)
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
    };

    const nullstillFeilmeldingForRegel = (regelId: string) => {
        settFeilmeldinger({
            ...feilmeldinger,
            delvilkårsvurderinger: { ...feilmeldinger.delvilkårsvurderinger, [regelId]: undefined },
        });
    };

    return delvilkårsett.map((delvikår, delvilkårIndex) => {
        return delvikår.vurderinger.map((svar) => {
            const gjeldendeRegel = regler[svar.regelId];
            const erUndervilkår = !gjeldendeRegel.erHovedregel;
            return (
                <React.Fragment key={gjeldendeRegel.regelId}>
                    {delvilkårIndex !== 0 && !erUndervilkår && <Skillelinje />}
                    <DelvilkårContainer $erUndervilkår={erUndervilkår}>
                        <DelvilkårRadioknapper
                            vurdering={svar}
                            regel={gjeldendeRegel}
                            settVurdering={(nyVurdering) => {
                                settDetFinnesUlagredeEndringer(true);
                                oppdaterSvar(delvikår.vurderinger, delvilkårIndex, nyVurdering);
                            }}
                            feilmelding={
                                feilmeldinger.delvilkårsvurderinger[gjeldendeRegel.regelId]
                            }
                            nullstillFeilmelding={nullstillFeilmeldingForRegel}
                        />
                        <Begrunnelse
                            oppdaterBegrunnelse={(begrunnelse) => {
                                settDetFinnesUlagredeEndringer(true);
                                oppdaterBegrunnelse(delvikår.vurderinger, delvilkårIndex, {
                                    ...svar,
                                    begrunnelse,
                                });
                            }}
                            vurdering={svar}
                            regel={gjeldendeRegel}
                        />
                    </DelvilkårContainer>
                </React.Fragment>
            );
        });
    });
};

export default EndreDelvilkår;
