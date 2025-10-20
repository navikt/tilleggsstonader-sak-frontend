import React, { useId, useState } from 'react';

import styled from 'styled-components';

import { HStack } from '@navikt/ds-react';

import { EndreVurderinger } from './EndreVilkårsvurderinger/EndreVurderinger';
import { useApp } from '../../../../../context/AppContext';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { SmallWarningTag } from '../../../../../komponenter/Tags';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';
import { EndreFaktaDagligReise } from './EndreFakta/EndreFaktaDagligReise';
import { initierGjeldendeFaktaType, initierSvar } from './utils';
import { TypeVilkårFakta } from '../typer/regelstrukturDagligReise';

const Container = styled.div`
    padding: 2rem;
    background-color: white;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Props {
    vilkår?: VilkårDagligReise;
    lagre: (
        periode: Periode,
        svar: SvarVilkårDagligReise,
        fakta?: FaktaDagligReise
    ) => Promise<RessursSuksess<VilkårDagligReise> | RessursFeilet>;
    avsluttRedigering: () => void;
}

export const EndreVilkårDagligReise: React.FC<Props> = ({ vilkår, lagre, avsluttRedigering }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent, harUlagradeKomponenter } = useApp();
    const komponentId = useId();

    const [svar, settSvar] = useState<SvarVilkårDagligReise>(initierSvar(vilkår));

    const [periode, settPeriode] = useState<Periode>({
        fom: vilkår?.fom || '',
        tom: vilkår?.tom || '',
    });

    // Må initieres
    const [gjeldendeFaktaType, settGjeldendeFaktaType] = useState<TypeVilkårFakta | undefined>(
        initierGjeldendeFaktaType(vilkår)
    );
    const [fakta, settFakta] = useState<FaktaDagligReise | undefined>(vilkår?.fakta);

    const [laster, settLaster] = useState(false);
    const [feilmeldingVedLagring, settFeilmeldingVedLagring] = useState<Feil | undefined>(
        undefined
    );

    const oppdaterPeriodeForVilkår = (datoKey: keyof Periode, nyVerdi: string | undefined) => {
        settPeriode((prevState) => ({ ...prevState, [datoKey]: nyVerdi }));
        settUlagretKomponent(komponentId);
    };

    const validerOgLagre = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (laster) return;
        settLaster(true);

        // TODO: valider at data er ok før det lagres ned

        lagreVilkår();
    };

    const lagreVilkår = async () => {
        const response = await lagre(periode, svar, fakta);

        if (response.status === RessursStatus.SUKSESS) {
            avsluttRedigering();
            settFeilmeldingVedLagring(undefined);
            nullstillUlagretKomponent(komponentId);
        } else {
            settFeilmeldingVedLagring(feiletRessursTilFeilmelding(response));
            nullstillUlagretKomponent(UlagretKomponent.STØNADSVILKÅR);
        }

        settLaster(false);
    };

    const oppdaterVurderinger = (nyeSvar: SvarVilkårDagligReise) => {
        settSvar(nyeSvar);
        settUlagretKomponent(komponentId);
    };

    return (
        <form onSubmit={validerOgLagre}>
            <Container>
                <HStack gap="4" align="start">
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label={'Fra'}
                            value={periode.fom}
                            onChange={(dato) => {
                                oppdaterPeriodeForVilkår('fom', dato);
                            }}
                            size="small"
                            // feil={feilmeldinger.fom}
                        />
                    </FeilmeldingMaksBredde>
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label={'Til'}
                            value={periode?.tom}
                            onChange={(dato) => {
                                oppdaterPeriodeForVilkår('tom', dato);
                            }}
                            size="small"
                            // feil={feilmeldinger.tom}
                        />
                    </FeilmeldingMaksBredde>
                </HStack>

                <Skillelinje />

                <EndreVurderinger
                    vurderinger={svar}
                    oppdaterVurderinger={oppdaterVurderinger}
                    oppdaterGjeldendeFaktaType={(gjeldendeFakta: TypeVilkårFakta | undefined) =>
                        settGjeldendeFaktaType(gjeldendeFakta)
                    }
                />

                <Skillelinje />

                <EndreFaktaDagligReise
                    gjeldendeFaktaType={gjeldendeFaktaType}
                    fakta={fakta}
                    settFakta={settFakta}
                />

                <HStack justify="space-between">
                    <HStack gap="4">
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={avsluttRedigering}>
                            Avbryt
                        </SmallButton>
                    </HStack>
                    {/* {vilkår && (
                        <SlettVilkårModal
                            vilkår={lagretVilkår}
                            avsluttRedigering={avsluttRedigering}
                        />
                    )} */}
                </HStack>
                {harUlagradeKomponenter && (
                    <SmallWarningTag>Du har ulagrede endringer</SmallWarningTag>
                )}
                <Feilmelding feil={feilmeldingVedLagring} />
            </Container>
        </form>
    );
};
