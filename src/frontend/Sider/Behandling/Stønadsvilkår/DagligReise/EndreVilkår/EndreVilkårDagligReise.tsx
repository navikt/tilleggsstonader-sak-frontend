import React, { useId, useState } from 'react';

import { HStack } from '@navikt/ds-react';

import { EndreVurderinger } from './EndreVilkårsvurderinger/EndreVurderinger';
import { SlettVilkårDagligReise } from './SlettVilkårDagligReise';
import { FeilmeldingerDagligReise, ingen, validerVilkår } from './validering';
import { useApp } from '../../../../../context/AppContext';
import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { SmallWarningTag } from '../../../../../komponenter/Tags';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { Periode } from '../../../../../utils/periode';
import { ingenFeil } from '../../../Vilkårvurdering/validering';
import { FaktaDagligReise, FaktaOffentligTransport } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';
import { EndreFaktaDagligReise } from './EndreFakta/EndreFaktaDagligReise';
import { initierGjeldendeFaktaType, initierSvar, tomtOffentligTransport } from './utils';
import { TypeVilkårFakta } from '../typer/regelstrukturDagligReise';

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
    const { regelstruktur } = useVilkårDagligReise();
    const komponentId = useId();

    const [svar, settSvar] = useState<SvarVilkårDagligReise>(initierSvar(vilkår));

    const [periode, settPeriode] = useState<Periode>({
        fom: vilkår?.fom || '',
        tom: vilkår?.tom || '',
    });

    const [gjeldendeFaktaType, settGjeldendeFaktaType] = useState<TypeVilkårFakta | undefined>(
        initierGjeldendeFaktaType(vilkår)
    );
    const [fakta, settFakta] = useState<FaktaDagligReise | undefined>(vilkår?.fakta);

    const [laster, settLaster] = useState(false);
    const [feilmeldingVedLagring, settFeilmeldingVedLagring] = useState<Feil | undefined>(
        undefined
    );

    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingerDagligReise>(ingenFeil);

    const oppdaterPeriodeForVilkår = (datoKey: keyof Periode, nyVerdi: string | undefined) => {
        settPeriode((prevState) => ({ ...prevState, [datoKey]: nyVerdi }));
        settUlagretKomponent(komponentId);
    };

    const validerOgLagre = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (laster) return;

        const valideringsfeil = validerVilkår(periode, svar, fakta, regelstruktur);
        settFeilmeldinger(valideringsfeil);
        if (!ingen(valideringsfeil)) {
            return;
        }

        lagreVilkår();
    };

    const lagreVilkår = async () => {
        settLaster(true);

        const response = await lagre(periode, svar, fakta);

        if (response.status === RessursStatus.SUKSESS) {
            avsluttRedigering();
            settFeilmeldingVedLagring(undefined);
            nullstillUlagretKomponent(komponentId);
        } else {
            settFeilmeldingVedLagring(feiletRessursTilFeilmelding(response));
        }
        settLaster(false);
    };

    const oppdaterFakta = (key: keyof FaktaOffentligTransport, verdi: number | undefined) => {
        settFakta((prevState) => ({
            ...(prevState ?? tomtOffentligTransport),
            [key]: verdi,
        }));

        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['fakta']);
    };

    const oppdaterVurderinger = (nyeSvar: SvarVilkårDagligReise) => {
        settSvar(nyeSvar);
        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['begrunnelse', 'fakta']);
    };

    const oppdaterGjeldendeFaktaType = (nyGjeldendeFaktaType: TypeVilkårFakta | undefined) => {
        if (gjeldendeFaktaType !== nyGjeldendeFaktaType) {
            settFakta(undefined);
        }
        settGjeldendeFaktaType(nyGjeldendeFaktaType);
        nullstillFeilmeldingFor(['fakta']);
    };

    const nullstillFeilmeldingFor = (feltListe: Array<keyof FeilmeldingerDagligReise>) => {
        settFeilmeldinger((prevState) => {
            feltListe.forEach((felt) => delete prevState[felt]);
            return { ...prevState };
        });
    };

    return (
        <form onSubmit={validerOgLagre}>
            <ResultatOgStatusKort periode={vilkår} redigeres>
                <HStack gap="4" align="start">
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label={'Fra'}
                            value={periode.fom}
                            onChange={(dato) => {
                                oppdaterPeriodeForVilkår('fom', dato);
                                nullstillFeilmeldingFor(['fom']);
                            }}
                            size="small"
                            feil={feilmeldinger.fom}
                        />
                    </FeilmeldingMaksBredde>
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label={'Til'}
                            value={periode?.tom}
                            onChange={(dato) => {
                                oppdaterPeriodeForVilkår('tom', dato);
                                nullstillFeilmeldingFor(['tom']);
                            }}
                            size="small"
                            feil={feilmeldinger.tom}
                        />
                    </FeilmeldingMaksBredde>
                </HStack>

                <Skillelinje />

                <EndreVurderinger
                    vurderinger={svar}
                    oppdaterVurderinger={oppdaterVurderinger}
                    oppdaterGjeldendeFaktaType={oppdaterGjeldendeFaktaType}
                    feilmeldinger={feilmeldinger}
                />

                <Skillelinje />

                <EndreFaktaDagligReise
                    gjeldendeFaktaType={gjeldendeFaktaType}
                    fakta={fakta}
                    oppdaterFakta={oppdaterFakta}
                    feilmeldinger={feilmeldinger}
                />

                {gjeldendeFaktaType && <Skillelinje />}

                <HStack justify="space-between">
                    <HStack gap="4">
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={avsluttRedigering}>
                            Avbryt
                        </SmallButton>
                    </HStack>
                    <SlettVilkårDagligReise
                        lagretVilkår={vilkår}
                        avsluttRedigering={avsluttRedigering}
                    />
                </HStack>
                {harUlagradeKomponenter && (
                    <SmallWarningTag>Du har ulagrede endringer</SmallWarningTag>
                )}
                <Feilmelding feil={feilmeldingVedLagring} />
            </ResultatOgStatusKort>
        </form>
    );
};
