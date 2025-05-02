import React, { FC, useEffect, useId, useState } from 'react';

import styled from 'styled-components';

import { TrashIcon } from '@navikt/aksel-icons';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import EndreDelvilkår from './EndreVilkår/EndreDelvilkår';
import { Feilmeldinger, ingen, ingenFeil, validerVilkårsvurderinger } from './validering';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { SmallWarningTag } from '../../../komponenter/Tags';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { Regler } from '../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import {
    Delvilkår,
    RedigerbareVilkårfelter,
    StønadsvilkårType,
    Vilkår,
    Vilkårsresultat,
} from '../vilkår';
import EndrePeriodeForVilkår, {
    EndrePeriodeForVilkårForm,
} from './EndreVilkår/EndrePeriodeForVilkår';

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

export const EndreVilkår: FC<EndreVilkårProps> = (props) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();
    const { behandling } = useBehandling();

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        props.redigerbareVilkårfelter.delvilkårsett
    );

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>(ingenFeil);

    const [endrePeriodeForVilkårForm, settEndrePeriodeForVilkårForm] =
        useState<EndrePeriodeForVilkårForm>({
            fom: props.redigerbareVilkårfelter.fom,
            tom: props.redigerbareVilkårfelter.tom,
            utgift: props.redigerbareVilkårfelter.utgift,
            erFremtidigUtgift: props.redigerbareVilkårfelter.erFremtidigUtgift,
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
            props.redigerbareVilkårfelter,
            props.regler,
            fom,
            tom,
            behandling.revurderFra,
            erFremtidigUtgift
        );

        settFeilmeldinger(valideringsfeil);

        if (ingen(valideringsfeil)) {
            const response = await props.lagreVurdering({
                delvilkårsett,
                fom,
                tom,
                utgift,
                erFremtidigUtgift,
            });
            if (response.status === RessursStatus.SUKSESS) {
                props.avsluttRedigering();
                settFeilmeldingVedLagring(null);
            } else {
                settFeilmeldingVedLagring(response.frontendFeilmelding);
            }
        }
    };

    const slettVilkår = props.slettVilkår;

    return (
        <StyledForm onSubmit={validerOgLagreVilkårsvurderinger}>
            <FlexColumn $gap={1}>
                <EndrePeriodeForVilkår
                    alleFelterKanRedigeres={props.alleFelterKanRedigeres}
                    settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                    vilkårtype={props.vilkårtype}
                    kanVæreFremtidigUtgift={props.kanVæreFremtidigUtgift}
                    endrePeriodeForVilkårFrom={endrePeriodeForVilkårForm}
                    oppdaterEndrePeriodeForVilkårForm={oppdaterendrePeriodeForVilkårForm}
                    feilmeldinger={feilmeldinger}
                    settFeilmeldinger={settFeilmeldinger}
                />
                <Skillelinje />
                {!endrePeriodeForVilkårForm.erFremtidigUtgift && (
                    <EndreDelvilkår
                        delvilkårsett={delvilkårsett}
                        regler={props.regler}
                        alleFelterKanRedigeres={props.alleFelterKanRedigeres}
                        settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                        feilmeldinger={feilmeldinger}
                        settFeilmeldinger={settFeilmeldinger}
                        settDelvilkårsett={settDelvilkårsett}
                    />
                )}
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
