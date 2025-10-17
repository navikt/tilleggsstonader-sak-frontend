import React, { useEffect, useState } from 'react';

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
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';
import { EndreFaktaDagligReise } from './EndreFakta/EndreFaktaDagligReise';
import { initierSvar } from './utils';
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
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();

    const [svar, settSvar] = useState<SvarVilkårDagligReise>(initierSvar(vilkår));

    const [periode, settPeriode] = useState<Periode>({
        fom: vilkår?.fom || '',
        tom: vilkår?.tom || '',
    });

    const [gjeldendeFaktaType, settGjeldendeFaktaType] = useState<TypeVilkårFakta | undefined>(
        undefined
    );
    const [fakta, settFakta] = useState<FaktaDagligReise | undefined>(undefined);

    const [laster, settLaster] = useState(false);
    const [feilmeldingVedLagring, settFeilmeldingVedLagring] = useState<Feil | undefined>(
        undefined
    );

    useEffect(() => {
        settUlagretKomponent(UlagretKomponent.STØNADSVILKÅR);
    }, [settUlagretKomponent]);

    const oppdaterPeriodeForVilkår = (datoKey: keyof Periode, nyVerdi: string | undefined) => {
        settPeriode((prevState) => ({ ...prevState, [datoKey]: nyVerdi }));
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
        } else {
            settFeilmeldingVedLagring(feiletRessursTilFeilmelding(response));
            nullstillUlagretKomponent(UlagretKomponent.STØNADSVILKÅR);
        }

        settLaster(false);
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
                    settVurderinger={settSvar}
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

                <SmallButton>Lagre</SmallButton>
                <SmallButton variant="secondary" onClick={avsluttRedigering}>
                    Avbryt
                </SmallButton>
                <Feilmelding feil={feilmeldingVedLagring} />
            </Container>
        </form>
    );
};
