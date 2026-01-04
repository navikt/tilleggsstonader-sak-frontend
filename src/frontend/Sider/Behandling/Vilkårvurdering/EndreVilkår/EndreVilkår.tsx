import React, { FC, useEffect, useId, useState } from 'react';

import { ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import EndreDelvilkår from './EndreDelvilkår';
import EndreErFremtidigUtgift from './EndreErFremtidigUtgift';
import EndrePeriodeForVilkår, {
    PeriodeForVilkår,
    TypePeriodeVelger,
} from './EndrePeriodeForVilkår';
import styles from './EndreVilkår.module.css';
import { SlettVilkår } from './SlettVilkår';
import { useApp } from '../../../../context/AppContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { SmallWarningTag } from '../../../../komponenter/Tags';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { Regler } from '../../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import {
    Delvilkår,
    RedigerbareVilkårfelter,
    StønadsvilkårType,
    Vilkår,
    Vilkårsresultat,
} from '../../vilkår';
import { Feilmeldinger, ingen, ingenFeil, validerVilkårsvurderinger } from '../validering';
import EndreUtgift from './EndreUtgift';

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
            vilkårtype === StønadsvilkårType.DAGLIG_REISE
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
        <form onSubmit={validerOgLagreVilkårsvurderinger}>
            <ResultatOgStatusKort periode={lagretVilkår} redigeres>
                <FlexColumn $gap={1}>
                    <HStack gap="4" align="start">
                        <EndrePeriodeForVilkår
                            periodeForVilkår={periodeForVilkår}
                            oppdaterPeriodeForVilkår={oppdaterPeriodeForVilkår}
                            feilmeldinger={feilmeldinger}
                            typePeriodeVelger={finnTypePeriodeVelger()}
                        />
                        {vilkårtype !== StønadsvilkårType.DAGLIG_REISE && (
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
                        <div className={styles.knapper}>
                            <SmallButton>Lagre</SmallButton>
                            <SmallButton variant="secondary" onClick={avsluttRedigering}>
                                Avbryt
                            </SmallButton>
                            <SlettVilkår
                                lagretVilkår={lagretVilkår}
                                avsluttRedigering={avsluttRedigering}
                            />
                        </div>
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
            </ResultatOgStatusKort>
        </form>
    );
};
