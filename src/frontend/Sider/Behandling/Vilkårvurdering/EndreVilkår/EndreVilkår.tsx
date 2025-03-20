import React, { FC, useEffect, useId, useState } from 'react';

import styled from 'styled-components';

import { TrashIcon } from '@navikt/aksel-icons';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { ABorderAction, AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import EndreVilkårPerioder from './EndreVilkårPerioder';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { SmallWarningTag } from '../../../../komponenter/Tags';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import {
    Delvilkår,
    RedigerbareVilkårfelter,
    StønadsvilkårType,
    Vilkår,
    Vilkårtype,
    Vurdering,
} from '../../vilkår';
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
import { Feilmeldinger, ingen, ingenFeil, validerVilkårsvurderinger } from '../validering';

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

const StyledForm = styled.form`
    background: white;
    padding: 2rem;
    box-shadow: ${AShadowXsmall};
`;

const Knapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;

    .right {
        margin-left: auto;
    }
`;

type EndreVilkårProps = {
    regler: Regler;
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    avsluttRedigering: () => void;
    lagreVurdering: (
        redigerbareVilkårfelter: RedigerbareVilkårfelter
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    slettVilkår: undefined | (() => void);
    alleFelterKanRedigeres: boolean;
    vilkårtype: Vilkårtype;
};

export const EndreVilkår: FC<EndreVilkårProps> = (props) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();
    const { behandling } = useBehandling();
    const erMidlertidigOvernatting = props.vilkårtype === StønadsvilkårType.MIDLERTIDIG_OVERNATTING;

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        props.redigerbareVilkårfelter.delvilkårsett
    );
    const [fom, settFom] = useState(props.redigerbareVilkårfelter.fom);
    const [tom, settTom] = useState(props.redigerbareVilkårfelter.tom);
    const [utgift, settUtgift] = useState(props.redigerbareVilkårfelter.utgift);
    const [erNullvedtak, settErNullvedtak] = useState(props.redigerbareVilkårfelter.erNullvedtak);

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>(ingenFeil);

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

        const valideringsfeil = validerVilkårsvurderinger(
            delvilkårsett,
            props.redigerbareVilkårfelter,
            props.regler,
            fom,
            tom,
            behandling.revurderFra
        );

        settFeilmeldinger(valideringsfeil);

        if (ingen(valideringsfeil)) {
            const response = await props.lagreVurdering({
                delvilkårsett,
                fom,
                tom,
                utgift,
                erNullvedtak,
            });
            if (response.status === RessursStatus.SUKSESS) {
                props.avsluttRedigering();
                settFeilmeldingVedLagring(null);
            } else {
                settFeilmeldingVedLagring(response.frontendFeilmelding);
            }
        }
    };

    const nullstillFeilmeldingForRegel = (regelId: string) => {
        settFeilmeldinger({
            ...feilmeldinger,
            delvilkårsvurderinger: { ...feilmeldinger.delvilkårsvurderinger, [regelId]: undefined },
        });
    };

    const oppdaterErNullvedtak = (erNullvedtak: boolean) => {
        settUtgift(undefined);
        settErNullvedtak(erNullvedtak);
    };

    const EndreDelvilkår = delvilkårsett.map((delvikår, delvilkårIndex) => {
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
                            readOnly={!props.alleFelterKanRedigeres}
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

    const slettVilkår = props.slettVilkår;

    return (
        <StyledForm onSubmit={validerOgLagreVilkårsvurderinger}>
            <FlexColumn $gap={1}>
                <EndreVilkårPerioder
                    fom={fom}
                    tom={tom}
                    settFom={settFom}
                    settTom={settTom}
                    erMidlertidigOvernatting={erMidlertidigOvernatting}
                    settFeilmeldinger={settFeilmeldinger}
                    feilmeldinger={feilmeldinger}
                    alleFelterKanRedigeres={props.alleFelterKanRedigeres}
                    settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                    utgift={utgift}
                    settUtgift={settUtgift}
                    erNullvedtak={erNullvedtak}
                    oppdaterErNullvedtak={oppdaterErNullvedtak}
                />
                <Skillelinje />
                {EndreDelvilkår}
                <VStack gap="4">
                    <Knapper>
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={props.avsluttRedigering}>
                            Avbryt
                        </SmallButton>
                        <div className={'right'}>
                            {slettVilkår && (
                                <SmallButton
                                    variant={'tertiary'}
                                    icon={<TrashIcon />}
                                    iconPosition={'right'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        slettVilkår();
                                    }}
                                >
                                    Slett vilkår
                                </SmallButton>
                            )}
                        </div>
                    </Knapper>
                    {detFinnesUlagredeEndringer && (
                        <SmallWarningTag>Du har ulagrede endringer</SmallWarningTag>
                    )}
                    {feilmeldingerVedLagring && (
                        <ErrorMessage size={'small'}>
                            Oppdatering av vilkår feilet: {feilmeldingerVedLagring}
                        </ErrorMessage>
                    )}
                </VStack>
            </FlexColumn>
        </StyledForm>
    );
};
