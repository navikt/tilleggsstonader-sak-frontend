import React, { FC, useEffect, useId, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { ErrorMessage, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction, AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

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
import MonthInput from '../../../komponenter/Skjema/MonthInput';
import TextField from '../../../komponenter/Skjema/TextField';
import SmallWarningTag from '../../../komponenter/SmallWarningTag';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { BegrunnelseRegel, Regler, Svaralternativ } from '../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { tilSisteDagenIMåneden } from '../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../utils/tall';
import { Toggle } from '../../../utils/toggles';
import { fjernSpaces } from '../../../utils/utils';
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

const StyledForm = styled.form`
    background: white;
    padding: 2rem;
    box-shadow: ${AShadowXsmall};
`;

type EndreVilkårProps = {
    regler: Regler;
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    avsluttRedigering: () => void;
    lagreVurdering: (
        redigerbareVilkårfelter: RedigerbareVilkårfelter
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
};

export const EndreVilkår: FC<EndreVilkårProps> = (props) => {
    const { nullstillUlagretKomponent, settUlagretKomponent } = useApp();

    const [detFinnesUlagredeEndringer, settDetFinnesUlagredeEndringer] = useState<boolean>(false);
    const [komponentId] = useId();

    const [delvilkårsett, settDelvilkårsett] = useState<Delvilkår[]>(
        props.redigerbareVilkårfelter.delvilkårsett
    );
    const [fom, settFom] = useState(props.redigerbareVilkårfelter.fom);
    const [tom, settTom] = useState(props.redigerbareVilkårfelter.tom);
    const [utgift, settUtgift] = useState(props.redigerbareVilkårfelter.utgift);

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const [feilmeldingerVedLagring, settFeilmeldingVedLagring] = useState<string | null>();

    const periodiserteVilkårIsEnabled = useFlag(Toggle.VILKÅR_PERIODISERING);

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
            const response = await props.lagreVurdering({ delvilkårsett, fom, tom, utgift });
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
        <StyledForm onSubmit={validerOgLagreVilkårsvurderinger}>
            <FlexColumn gap={1}>
                {periodiserteVilkårIsEnabled && (
                    <HStack gap="6">
                        <MonthInput
                            label="Periode fra og med"
                            size="small"
                            value={fom}
                            onChange={settFom}
                        />
                        <MonthInput
                            label="Periode til og med"
                            size="small"
                            value={tom}
                            onChange={(dato) =>
                                settTom(dato ? tilSisteDagenIMåneden(dato) : undefined)
                            }
                        />
                        <TextField
                            label="Månedlig utgift"
                            size="small"
                            erLesevisning={false}
                            value={harTallverdi(utgift) ? utgift : ''}
                            onChange={(e) => settUtgift(tilHeltall(fjernSpaces(e.target.value)))}
                        />
                    </HStack>
                )}
                <Skillelinje />
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
                    <HStack gap="3">
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={props.avsluttRedigering}>
                            Avslutt
                        </SmallButton>
                    </HStack>
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
