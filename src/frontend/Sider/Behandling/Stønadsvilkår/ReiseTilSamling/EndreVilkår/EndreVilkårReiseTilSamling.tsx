import React, { useId, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { v7 } from 'uuid';

import { HStack, TextField } from '@navikt/ds-react';

import styles from './EndreVilkårReiseTilSamling.module.css';
import { SlettVilkårReiseTilSamling } from './SlettVilkårReiseTilSamling';
import { initierGjeldendeFaktaType, initierSvar } from './utils';
import { FeilmeldingerReiseTilSamling, ingen, validerVilkår } from './validering';
import { useApp } from '../../../../../context/AppContext';
import { useVilkårReiseTilSamling } from '../../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
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
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { ingenFeil } from '../../../Vilkårvurdering/validering';
import { EndreFaktaReiseTilSamling } from '../EndreFakta/EndreFaktaReiseTilSamling';
import { EndreVurderinger } from '../EndreVilkårsVurderinger/EndreVurderinger';
import { FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';
import { TypeVilkårFakta } from '../typer/regelstrukturReiseTilSamling';
import { SvarVilkårReiseTilSamling, VilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

interface Props {
    vilkår?: VilkårReiseTilSamling;
    lagre: (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårReiseTilSamling,
        fakta: FaktaReiseTilSamling
    ) => Promise<RessursSuksess<VilkårReiseTilSamling> | RessursFeilet>;
    avsluttRedigering: () => void;
}

export const EndreVilkårReiseTilSamling: React.FC<Props> = ({
    vilkår,
    lagre,
    avsluttRedigering,
}) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { regelstruktur } = useVilkårReiseTilSamling();
    const komponentId = useId();
    const kanBehandleReiseTilSamling = useFlag(Toggle.KAN_BEHANDLE_REISE_TIL_SAMLING);

    const [svar, settSvar] = useState<SvarVilkårReiseTilSamling>(initierSvar(vilkår));

    const [periode, settPeriode] = useState<Periode>({
        fom: vilkår?.fom || '',
        tom: vilkår?.tom || '',
    });

    const [adresse, settAdresse] = useState<string | undefined>(vilkår?.adresse);
    const [reiseId] = useState<string>(vilkår?.reiseId || v7());

    const [gjeldendeFaktaType, settGjeldendeFaktaType] = useState<TypeVilkårFakta>(
        initierGjeldendeFaktaType(vilkår)
    );

    const [fakta, settFakta] = useState<FaktaReiseTilSamling>(
        vilkår?.fakta || { type: 'UBESTEMT' }
    );

    const [laster, settLaster] = useState(false);
    const [feilmeldingVedLagring, settFeilmeldingVedLagring] = useState<Feil | undefined>(
        undefined
    );

    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingerReiseTilSamling>(ingenFeil);

    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useHarEndretDatoerFørTidligereVedtak({
            tidligere: vilkår,
            ny: periode,
        });

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

        if (burdeViseModal) {
            settVisBekreftModal(true);
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

    const oppdaterVurderinger = (nyeSvar: SvarVilkårReiseTilSamling) => {
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

    const nullstillFeilmeldingFor = (feltListe: Array<keyof FeilmeldingerReiseTilSamling>) => {
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
                <HStack gap="space-16" align="start">
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

                <EndreFaktaReiseTilSamling
                    gjeldendeFaktaType={gjeldendeFaktaType}
                    fakta={fakta}
                    settFakta={settFakta}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    feilmeldinger={feilmeldinger}
                />

                <HStack justify="space-between">
                    <HStack gap="space-16">
                        <SmallButton disabled={!kanBehandleReiseTilSamling} onClick={lagreVilkår}>
                            Lagre
                        </SmallButton>
                        <SmallButton variant="secondary" onClick={handleAvsluttRedigering}>
                            Avbryt
                        </SmallButton>
                    </HStack>
                    <SlettVilkårReiseTilSamling
                        lagretVilkår={vilkår}
                        avsluttRedigering={handleAvsluttRedigering}
                    />
                </HStack>
                <Feilmelding feil={feilmeldingVedLagring} />
                <BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal
                    visBekreftModal={visBekreftModal}
                    settVisBekreftModal={settVisBekreftModal}
                    bekreftLagre={lagreVilkår}
                    laster={laster}
                />
            </ResultatOgStatusKort>
        </form>
    );
};
