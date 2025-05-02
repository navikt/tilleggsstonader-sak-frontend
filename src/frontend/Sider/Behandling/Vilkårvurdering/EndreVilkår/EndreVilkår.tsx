import React, { FC, useEffect, useId, useState } from 'react';

import styled from 'styled-components';

import { TrashIcon } from '@navikt/aksel-icons';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import EndreDelvilkår from './EndreDelvilkår';
import EndrePeriodeForVilkår, {
    EndrePeriodeForVilkårForm,
    TypePeriodeVelger,
} from './EndrePeriodeForVilkår';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { SmallWarningTag } from '../../../../komponenter/Tags';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { Regler } from '../../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import {
    Delvilkår,
    RedigerbareVilkårfelter,
    StønadsvilkårType,
    Vilkår,
    Vilkårsresultat,
} from '../../vilkår';
import { Feilmeldinger, ingen, ingenFeil, validerVilkårsvurderinger } from '../validering';

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
    vilkårtype: StønadsvilkårType;
    kanVæreFremtidigUtgift: boolean;
};

export const EndreVilkår: FC<EndreVilkårProps> = ({
    alleFelterKanRedigeres,
    avsluttRedigering,
    kanVæreFremtidigUtgift,
    lagreVurdering,
    redigerbareVilkårfelter,
    regler,
    slettVilkår,
    vilkårtype,
}) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();
    const { behandling } = useBehandling();

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        redigerbareVilkårfelter.delvilkårsett
    );

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>(ingenFeil);

    const [endrePeriodeForVilkårForm, settEndrePeriodeForVilkårForm] =
        useState<EndrePeriodeForVilkårForm>({
            fom: redigerbareVilkårfelter.fom,
            tom: redigerbareVilkårfelter.tom,
            utgift: redigerbareVilkårfelter.utgift,
            erFremtidigUtgift: redigerbareVilkårfelter.erFremtidigUtgift,
        });

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

    const oppdaterendrePeriodeForVilkårForm = (
        key: keyof EndrePeriodeForVilkårForm,
        nyVerdi: string | number | boolean | undefined
    ) => {
        if (key === 'erFremtidigUtgift') {
            nullstillDelvilkårsett();
        }
        settEndrePeriodeForVilkårForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

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

    const validerOgLagreVilkårsvurderinger = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { fom, tom, utgift, erFremtidigUtgift } = endrePeriodeForVilkårForm;

        const valideringsfeil = validerVilkårsvurderinger(
            delvilkårsett,
            redigerbareVilkårfelter,
            regler,
            fom,
            tom,
            behandling.revurderFra,
            erFremtidigUtgift
        );

        settFeilmeldinger(valideringsfeil);

        if (ingen(valideringsfeil)) {
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
        }
    };

    const finnTypePeriodeVelger = () => {
        if (vilkårtype === StønadsvilkårType.UTGIFTER_OVERNATTING) {
            return TypePeriodeVelger.DATO;
        }
        return TypePeriodeVelger.MANED_ÅR;
    };

    return (
        <StyledForm onSubmit={validerOgLagreVilkårsvurderinger}>
            <FlexColumn $gap={1}>
                <EndrePeriodeForVilkår
                    alleFelterKanRedigeres={alleFelterKanRedigeres}
                    settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                    vilkårtype={vilkårtype}
                    kanVæreFremtidigUtgift={kanVæreFremtidigUtgift}
                    endrePeriodeForVilkårFrom={endrePeriodeForVilkårForm}
                    oppdaterEndrePeriodeForVilkårForm={oppdaterendrePeriodeForVilkårForm}
                    feilmeldinger={feilmeldinger}
                    settFeilmeldinger={settFeilmeldinger}
                    typePeriodeVelger={finnTypePeriodeVelger()}
                />
                <Skillelinje />
                {!endrePeriodeForVilkårForm.erFremtidigUtgift && (
                    <EndreDelvilkår
                        delvilkårsett={delvilkårsett}
                        regler={regler}
                        alleFelterKanRedigeres={alleFelterKanRedigeres}
                        settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                        feilmeldinger={feilmeldinger}
                        settFeilmeldinger={settFeilmeldinger}
                        settDelvilkårsett={settDelvilkårsett}
                    />
                )}
                <VStack gap="4">
                    <Knapper>
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={avsluttRedigering}>
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
