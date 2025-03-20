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

export const EndreVilkår: FC<EndreVilkårProps> = ({
    alleFelterKanRedigeres,
    avsluttRedigering,
    lagreVurdering,
    redigerbareVilkårfelter,
    regler,
    slettVilkår,
    vilkårtype,
}) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();
    const { behandling } = useBehandling();
    const erMidlertidigOvernatting = vilkårtype === StønadsvilkårType.MIDLERTIDIG_OVERNATTING;

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        redigerbareVilkårfelter.delvilkårsett
    );
    const [fom, settFom] = useState(redigerbareVilkårfelter.fom);
    const [tom, settTom] = useState(redigerbareVilkårfelter.tom);
    const [utgift, settUtgift] = useState(redigerbareVilkårfelter.utgift);
    const [erNullvedtak, settErNullvedtak] = useState(redigerbareVilkårfelter.erNullvedtak);

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
            redigerbareVilkårfelter,
            regler,
            fom,
            tom,
            behandling.revurderFra
        );

        settFeilmeldinger(valideringsfeil);

        if (ingen(valideringsfeil)) {
            const response = await lagreVurdering({
                delvilkårsett,
                fom,
                tom,
                utgift,
                erNullvedtak,
            });
            if (response.status === RessursStatus.SUKSESS) {
                avsluttRedigering();
                settFeilmeldingVedLagring(null);
            } else {
                settFeilmeldingVedLagring(response.frontendFeilmelding);
            }
        }
    };

    return (
        <StyledForm onSubmit={validerOgLagreVilkårsvurderinger}>
            <FlexColumn $gap={1}>
                <EndreVilkårPerioder
                    fom={fom}
                    tom={tom}
                    utgift={utgift}
                    erNullvedtak={erNullvedtak}
                    feilmeldinger={feilmeldinger}
                    erMidlertidigOvernatting={erMidlertidigOvernatting}
                    alleFelterKanRedigeres={alleFelterKanRedigeres}
                    settFom={settFom}
                    settTom={settTom}
                    settUtgift={settUtgift}
                    settErNullvedtak={settErNullvedtak}
                    settFeilmeldinger={settFeilmeldinger}
                    settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                />
                <Skillelinje />
                <EndreDelvilkår
                    delvilkårsett={delvilkårsett}
                    settDelvilkårsett={settDelvilkårsett}
                    regler={regler}
                    alleFelterKanRedigeres={alleFelterKanRedigeres}
                    settDetFinnesUlagredeEndringer={settDetFinnesUlagredeEndringer}
                    feilmeldinger={feilmeldinger}
                    settFeilmeldinger={settFeilmeldinger}
                />
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
