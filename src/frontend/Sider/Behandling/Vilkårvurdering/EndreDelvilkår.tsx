import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { FeilmeldingFraVilkårsoppdatering } from './FeilmeldingFravilkårsoppdatering';
import { LagreknappMedStatus } from './LagreknappMedStatus';
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

const EndreDelvilkår: FC<{
    regler: Regler;
    vilkår: Vilkår;
}> = ({ regler, vilkår }) => {
    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(vilkår.delvilkårsett);
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});
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
                    settErLagret(true);
                }
            });
        }
    };

    const [erLagret, settErLagret] = useState<boolean>(false);

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
                                        settVurdering={(nyVurdering) => {
                                            settErLagret(false);
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
                                            settErLagret(false);
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
                <HStack gap="1">
                    <Skillelinje />
                    <LagreknappMedStatus vilkårId={vilkår.id} erLagret={erLagret} />
                </HStack>
                <FeilmeldingFraVilkårsoppdatering vilkårId={vilkår.id} />
            </VStack>
        </form>
    );
};
export default EndreDelvilkår;
