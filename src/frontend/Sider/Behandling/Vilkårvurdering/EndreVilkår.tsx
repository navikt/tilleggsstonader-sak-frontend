import React, { FC, useEffect, useId, useState } from 'react';

import styled from 'styled-components';

import { ErrorMessage, VStack } from '@navikt/ds-react';
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
import { useApp } from '../../../context/AppContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import SmallWarningTag from '../../../komponenter/SmallWarningTag';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { Delvilkår, Vilkår, RedigerbareVilkårfelter, Vurdering } from '../vilkår';

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

type EndreDelvilkårProps = {
    regler: Regler;
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    avsluttRedigering: () => void;
    lagreVurdering: (
        redigerbareVilkårfelter: RedigerbareVilkårfelter,
        komponentId: string // TODO: Brukes denne?
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
};

export const EndreVilkår: FC<EndreDelvilkårProps> = (props) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        props.redigerbareVilkårfelter.delvilkårsett
    );

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const [feilmeldingerVedLagring, settFeilmeldingVedLagring] = useState<string | null>();

    useEffect(() => {
        if (detFinnesUlagredeEndringer) {
            settUlagretKomponent(komponentId);
        } else {
            nullstillUlagretKomponent(komponentId);
        }
        return () => {
            nullstillUlagretKomponent(komponentId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detFinnesUlagredeEndringer]);

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
        const svaralternativ: Svaralternativ | undefined = hentSvaralternativ(
            props.regler,
            nyttSvar
        );
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
        const svaralternativer: Svaralternativ | undefined = hentSvaralternativ(
            props.regler,
            nyttSvar
        );

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
            props.regler
        );

        oppdaterVilkårsvar(delvilkårIndex, oppdaterteSvarMedKopiertBegrunnelse);
    };

    const validerOgLagreVilkårsvurderinger = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurderinger(delvilkårsett, props.regler);

        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            const response = await props.lagreVurdering(
                {
                    delvilkårsett: delvilkårsett,
                    fom: fom,
                    tom: tom,
                    beløp: beløp,
                },
                komponentId
            );
            if (response.status === RessursStatus.SUKSESS) {
                props.avsluttRedigering();
                settFeilmeldingVedLagring(null);
            } else {
                settFeilmeldingVedLagring(response.frontendFeilmelding);
            }
        }
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurderinger}>
            <VStack gap="4">
                {delvilkårsett.map((delvikår, delvilkårIndex) => {
                    return delvikår.vurderinger.map((svar) => {
                        const gjeldendeRegel = props.regler[svar.regelId];
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
                    {feilmeldingerVedLagring && (
                        <ErrorMessage size={'small'}>
                            Oppdatering av vilkår feilet: {feilmeldingerVedLagring}
                        </ErrorMessage>
                    )}
                </VStack>
            </VStack>
        </form>
    );
};
