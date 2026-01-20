import React, { useId, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { v7 } from 'uuid';

import { HStack, TextField } from '@navikt/ds-react';

import styles from './EndreVilkårDagligReise.module.css';
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
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { Periode } from '../../../../../utils/periode';
import { Toggle } from '../../../../../utils/toggles';
import { ingenFeil } from '../../../Vilkårvurdering/validering';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';
import { EndreFaktaDagligReise } from './EndreFakta/EndreFaktaDagligReise';
import { initierGjeldendeFaktaType, initierSvar } from './utils';
import { TypeVilkårFakta } from '../typer/regelstrukturDagligReise';

interface Props {
    vilkår?: VilkårDagligReise;
    lagre: (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårDagligReise,
        fakta: FaktaDagligReise
    ) => Promise<RessursSuksess<VilkårDagligReise> | RessursFeilet>;
    avsluttRedigering: () => void;
}

export const EndreVilkårDagligReise: React.FC<Props> = ({ vilkår, lagre, avsluttRedigering }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { regelstruktur } = useVilkårDagligReise();
    const komponentId = useId();
    const kanBehandlePrivatBil = useFlag(Toggle.KAN_BEHANDLE_PRIVAT_BIL);

    const [svar, settSvar] = useState<SvarVilkårDagligReise>(initierSvar(vilkår));

    const [periode, settPeriode] = useState<Periode>({
        fom: vilkår?.fom || '',
        tom: vilkår?.tom || '',
    });

    const [adresse, settAdresse] = useState<string | undefined>(vilkår?.adresse);
    const [reiseId] = useState<string>(vilkår?.reiseId || v7());

    const [gjeldendeFaktaType, settGjeldendeFaktaType] = useState<TypeVilkårFakta>(
        initierGjeldendeFaktaType(vilkår)
    );
    const [fakta, settFakta] = useState<FaktaDagligReise>(vilkår?.fakta || { type: 'UBESTEMT' });

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

        const valideringsfeil = validerVilkår(periode, adresse, svar, fakta, regelstruktur);
        settFeilmeldinger(valideringsfeil);
        if (!ingen(valideringsfeil)) {
            return;
        }

        await lagreVilkår();
    };

    const lagreVilkår = async () => {
        settLaster(true);

        const response = await lagre(periode, adresse, reiseId, svar, fakta);

        if (response.status === RessursStatus.SUKSESS) {
            avsluttRedigering();
            settFeilmeldingVedLagring(undefined);
            nullstillUlagretKomponent(komponentId);
        } else {
            settFeilmeldingVedLagring(feiletRessursTilFeilmelding(response));
        }
        settLaster(false);
    };

    const nullstillFeilOgUlagretkomponent = () => {
        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['fakta']);
    };

    const oppdaterAdresse = (nyAdresse: string | undefined) => {
        settAdresse(nyAdresse);
        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['adresse']);
    };

    const oppdaterVurderinger = (nyeSvar: SvarVilkårDagligReise) => {
        settSvar(nyeSvar);
        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['begrunnelse', 'fakta']);
    };

    const oppdaterGjeldendeFaktaType = (nyGjeldendeFaktaType: TypeVilkårFakta) => {
        if (gjeldendeFaktaType !== nyGjeldendeFaktaType) {
            settFakta({ type: 'UBESTEMT' });
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

    const handleAvsluttRedigering = () => {
        nullstillUlagretKomponent(komponentId);
        avsluttRedigering();
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
                    <FeilmeldingMaksBredde $maxWidth={380}>
                        <TextField
                            label={'Adresse aktivitet'}
                            size="small"
                            error={feilmeldinger?.adresse}
                            value={adresse || ''}
                            onChange={(e) => {
                                oppdaterAdresse(e.target.value || undefined);
                                nullstillFeilmeldingFor(['adresse']);
                            }}
                            className={styles.adressefelt}
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
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    settFakta={settFakta}
                    feilmeldinger={feilmeldinger}
                />

                {gjeldendeFaktaType && <Skillelinje />}

                <HStack justify="space-between">
                    <HStack gap="4">
                        <SmallButton
                            disabled={
                                !kanBehandlePrivatBil &&
                                gjeldendeFaktaType === 'DAGLIG_REISE_PRIVAT_BIL'
                            }
                        >
                            Lagre
                        </SmallButton>
                        <SmallButton variant="secondary" onClick={handleAvsluttRedigering}>
                            Avbryt
                        </SmallButton>
                    </HStack>
                    <SlettVilkårDagligReise
                        lagretVilkår={vilkår}
                        avsluttRedigering={handleAvsluttRedigering}
                    />
                </HStack>
                <Feilmelding feil={feilmeldingVedLagring} />
            </ResultatOgStatusKort>
        </form>
    );
};
