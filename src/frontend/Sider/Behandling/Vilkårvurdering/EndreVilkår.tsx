import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { FeilmeldingFraVilkårsoppdatering } from './FeilmeldingFravilkårsoppdatering';
import LesevisningVilkår from './LesevisningVilkår';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    hentSvaralternativ,
    kanHaBegrunnelse,
    kopierBegrunnelse,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from './utils';
import { Feilmeldinger, validerVilkårsvurderinger } from './validering';
import { useVilkår } from '../../../context/VilkårContext';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import SmallButton from '../../../komponenter/SmallButton';
import SmallWarningTag from '../../../komponenter/SmallWarningTag';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../typer/regel';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { Delvilkår, Vilkår, Vurdering } from '../vilkår';

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

const EndreVilkår: FC<{
    regler: Regler;
    vilkår: Vilkår;
}> = ({ regler, vilkår }) => {
    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(vilkår.delvilkårsett);

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const [erIRedigeringsmodus, settErIRedigeringsmodus] = useState<boolean>(true);

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);

    const { lagreVilkår } = useVilkår();

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

    const validerOgLagreVilkårsvurderinger = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurderinger(delvilkårsett, regler);

        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            lagreVilkår({
                id: vilkår.id,
                behandlingId: vilkår.behandlingId,
                delvilkårsett: delvilkårsett,
            }).then((response: Ressurs<Vilkår>) => {
                if (response.status === RessursStatus.SUKSESS) {
                    settErIRedigeringsmodus(false);
                }
            });
        }
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    if (!erIRedigeringsmodus) {
        return (
            <>
                <LesevisningVilkår vilkår={vilkår} />
                <VStack gap={'6'}>
                    <Skillelinje />
                    <SmallButton
                        onClick={() => {
                            settDetFinnesUlagredeEndringer(false);
                            settErIRedigeringsmodus(true);
                        }}
                    >
                        Rediger
                    </SmallButton>
                </VStack>
            </>
        );
    }

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
                                        settVurdering={(nyVurdering) => {
                                            settDetFinnesUlagredeEndringer(true);
                                            oppdaterSvar(
                                                delvikår.vurderinger,
                                                delvilkårIndex,
                                                nyVurdering
                                            );
                                        }}
                                        feilmelding={feilmeldinger[gjeldendeRegel.regelId]}
                                        nullstillFeilmelding={nullstillFeilmelding}
                                    />
                                    <Begrunnelse
                                        oppdaterBegrunnelse={(begrunnelse) => {
                                            settDetFinnesUlagredeEndringer(true);
                                            oppdaterBegrunnelse(
                                                delvikår.vurderinger,
                                                delvilkårIndex,
                                                {
                                                    ...svar,
                                                    begrunnelse,
                                                }
                                            );
                                        }}
                                        vurdering={svar}
                                        regel={gjeldendeRegel}
                                    />
                                </DelvilkårContainer>
                            </React.Fragment>
                        );
                    });
                })}
                <VStack gap="4">
                    <Skillelinje />
                    <SmallButton>Lagre</SmallButton>
                    {detFinnesUlagredeEndringer && (
                        <SmallWarningTag>Du har ulagrede endringer</SmallWarningTag>
                    )}
                    <FeilmeldingFraVilkårsoppdatering vilkårId={vilkår.id} />
                </VStack>
            </VStack>
        </form>
    );
};
export default EndreVilkår;
