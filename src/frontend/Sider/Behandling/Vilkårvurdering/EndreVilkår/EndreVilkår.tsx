import React, { FC, useEffect, useId, useState } from 'react';

import styled from 'styled-components';

import { ErrorMessage, HStack, VStack } from '@navikt/ds-react';
import { ShadowDialog } from '@navikt/ds-tokens/darkside-js';

import EndreDelvilkår from './EndreDelvilkår';
import EndreErFremtidigUtgift from './EndreErFremtidigUtgift';
import EndrePeriodeForVilkår, {
    PeriodeForVilkår,
    TypePeriodeVelger,
} from './EndrePeriodeForVilkår';
import { useApp } from '../../../../context/AppContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { SmallWarningTag } from '../../../../komponenter/Tags';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { Regler } from '../../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import {
    Delvilkår,
    RedigerbareVilkårfelter,
    StønadsvilkårType,
    Vilkår,
    Vilkårsresultat,
} from '../../vilkår';
import { Feilmeldinger, ingen, ingenFeil, validerVilkårsvurderinger } from '../validering';
import EndreUtgift from './EndreUtgift';
import SlettVilkårModal from './SlettVilkårModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';

const StyledForm = styled.form`
    background: white;
    padding: 2rem;
    box-shadow: ${ShadowDialog};
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
    lagretVilkår: Vilkår | undefined;
    regler: Regler;
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    avsluttRedigering: () => void;
    lagreVurdering: (
        redigerbareVilkårfelter: RedigerbareVilkårfelter
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    vilkårtype: StønadsvilkårType;
    kanVæreFremtidigUtgift: boolean;
};

export const EndreVilkår: FC<EndreVilkårProps> = ({
    lagretVilkår,
    avsluttRedigering,
    kanVæreFremtidigUtgift,
    lagreVurdering,
    redigerbareVilkårfelter,
    regler,
    vilkårtype,
}) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        redigerbareVilkårfelter.delvilkårsett
    );

    const [periodeForVilkår, settPeriodeForVilkår] = useState<PeriodeForVilkår>({
        fom: redigerbareVilkårfelter.fom,
        tom: redigerbareVilkårfelter.tom,
    });
    const [utgift, settUtgift] = useState<number | undefined>(redigerbareVilkårfelter.utgift);
    const [erFremtidigUtgift, settErFremtidigUtgift] = useState<boolean | undefined>(
        redigerbareVilkårfelter.erFremtidigUtgift
    );

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>(ingenFeil);
    const [feilmeldingerVedLagring, settFeilmeldingVedLagring] = useState<string | null>();
    const [laster, settLaster] = useState<boolean>(false);

    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useHarEndretDatoerFørTidligereVedtak({
            tidligere: redigerbareVilkårfelter,
            ny: periodeForVilkår,
        });

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

    const validerOgLagreVilkårsvurderinger = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (laster) return;

        const valideringsfeil = validerVilkårsvurderinger(
            delvilkårsett,
            regler,
            periodeForVilkår.fom,
            periodeForVilkår.tom,
            erFremtidigUtgift
        );

        settFeilmeldinger(valideringsfeil);
        if (!ingen(valideringsfeil)) {
            return;
        }

        if (burdeViseModal) {
            settVisBekreftModal(true);
            return;
        }
        bekreftLagre();
    };

    const bekreftLagre = async () => {
        const { fom, tom } = periodeForVilkår;
        settLaster(true);

        const response = await lagreVurdering({
            delvilkårsett,
            fom,
            tom,
            utgift,
            erFremtidigUtgift,
        });
        if (response.status === RessursStatus.SUKSESS) {
            avsluttRedigering();
            settFeilmeldingVedLagring(null);
        } else {
            settFeilmeldingVedLagring(response.frontendFeilmelding);
        }
        settLaster(false);
    };

    const finnTypePeriodeVelger = () => {
        if (
            vilkårtype === StønadsvilkårType.UTGIFTER_OVERNATTING ||
            vilkårtype === StønadsvilkårType.DAGLIG_REISE_OFFENTLIG_TRANSPORT
        ) {
            return TypePeriodeVelger.DATO;
        }
        return TypePeriodeVelger.MANED_ÅR;
    };

    const nullstillDelvilkårsett = () =>
        settDelvilkårsett(
            delvilkårsett.map((delvilkår) => ({
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vurderinger: delvilkår.vurderinger.map((vurdering) => ({
                    regelId: vurdering.regelId,
                    svar: undefined,
                    begrunnelse: undefined,
                })),
            }))
        );

    const oppdaterPeriodeForVilkår = (key: keyof PeriodeForVilkår, nyVerdi: string | undefined) => {
        settPeriodeForVilkår((prevState) => ({ ...prevState, [key]: nyVerdi }));
        settFeilmeldinger((prevState) => ({ ...prevState, [key]: undefined }));
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterErFremtidigUtgift = (verdi: boolean) => {
        settErFremtidigUtgift(verdi);
        nullstillDelvilkårsett();
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterUtgift = (verdi: number | undefined) => {
        settUtgift(verdi);
        settFeilmeldinger((prevState) => ({ ...prevState, utgift: undefined }));
        settDetFinnesUlagredeEndringer(true);
    };

    return (
        <StyledForm onSubmit={validerOgLagreVilkårsvurderinger}>
            <FlexColumn $gap={1}>
                <HStack gap="4" align="start">
                    <EndrePeriodeForVilkår
                        periodeForVilkår={periodeForVilkår}
                        oppdaterPeriodeForVilkår={oppdaterPeriodeForVilkår}
                        feilmeldinger={feilmeldinger}
                        typePeriodeVelger={finnTypePeriodeVelger()}
                    />
                    {vilkårtype !== StønadsvilkårType.DAGLIG_REISE_OFFENTLIG_TRANSPORT && (
                        <EndreUtgift
                            vilkårtype={vilkårtype}
                            erFremtidigUtgift={erFremtidigUtgift}
                            oppdaterUtgift={oppdaterUtgift}
                            utgift={utgift}
                        />
                    )}
                    <EndreErFremtidigUtgift
                        vilkårtype={vilkårtype}
                        erFremtidigUtgift={erFremtidigUtgift}
                        oppdaterErFremtidigUtgift={oppdaterErFremtidigUtgift}
                        kanVæreFremtidigUtgift={kanVæreFremtidigUtgift}
                    />
                </HStack>
                <Skillelinje />
                {!erFremtidigUtgift && (
                    <EndreDelvilkår
                        delvilkårsett={delvilkårsett}
                        regler={regler}
                        settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                        feilmeldinger={feilmeldinger}
                        settFeilmeldinger={settFeilmeldinger}
                        settDelvilkårsett={settDelvilkårsett}
                    />
                )}
                <Skillelinje />

                <VStack gap="4">
                    <Knapper>
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={avsluttRedigering}>
                            Avbryt
                        </SmallButton>
                        <div className={'right'}>
                            {lagretVilkår && (
                                <SlettVilkårModal
                                    vilkår={lagretVilkår}
                                    avsluttRedigering={avsluttRedigering}
                                />
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
            <BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal
                visBekreftModal={visBekreftModal}
                settVisBekreftModal={settVisBekreftModal}
                bekreftLagre={bekreftLagre}
                laster={laster}
            />
        </StyledForm>
    );
};
