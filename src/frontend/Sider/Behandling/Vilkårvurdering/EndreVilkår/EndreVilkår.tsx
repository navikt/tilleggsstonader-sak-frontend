import React, { FC, useEffect, useId, useState } from 'react';

import styled from 'styled-components';

import { TrashIcon } from '@navikt/aksel-icons';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import EndreVilkårPerioder from './EndreVilkårPerioder';
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
    Vilkårtype,
} from '../../vilkår';
import { Feilmeldinger, ingen, ingenFeil, validerVilkårsvurderinger } from '../validering';
import EndreDelvilkår from './EndreDelvilkår';

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

    const oppdaterErNullvedtak = (erNullvedtak: boolean) => {
        settUtgift(undefined);
        settErNullvedtak(erNullvedtak);
    };

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
                <EndreDelvilkår
                    delvilkårsett={delvilkårsett}
                    settDelvilkårsett={settDelvilkårsett}
                    regler={props.regler}
                    alleFelterKanRedigeres={props.alleFelterKanRedigeres}
                    settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                    feilmeldinger={feilmeldinger}
                    settFeilmeldinger={settFeilmeldinger}
                />
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
