import React, { useId, useState } from 'react';

import { v7 } from 'uuid';

import { HStack, Select } from '@navikt/ds-react';

import { SlettVilkårReiseOppstartAvslutningHjemreise } from './SlettVilkårReiseOppstartAvslutningHjemreise';
import {
    finnRegelstrukturForReiseformål,
    initierGjeldendeFaktaType,
    initierSvar,
    tomtSvar,
    tomtUbestemtFakta,
} from './utils';
import {
    FeilmeldingerReiseOppstartAvslutningHjemreise,
    harValideringsFeil,
    validerVilkår,
} from './validering';
import { useApp } from '../../../../../context/AppContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
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
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { ingenFeil } from '../../../Vilkårvurdering/validering';
import { EndreFaktaReiseOppstartAvslutningHjemreise } from '../EndreFakta/EndreFaktaReiseOppstartAvslutningHjemreise';
import { EndreVurderinger } from '../EndreVilkårsVurderinger/EndreVurderinger';
import { FaktaReiseOppstartAvslutningHjemreise } from '../typer/faktaReiseOppstartAvslutningHjemreise';
import {
    Regelstruktur,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    LagreNyttVilkårReiseOppstartAvslutningHjemreise,
    SvarVilkårReiseOppstartAvslutningHjemreise,
    TypeReiseformål,
    typeReiseformålTilTekst,
    VilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    vilkår?: VilkårReiseOppstartAvslutningHjemreise;
    aktivitet: Aktivitet;
    lagre: (
        vilkårTilLagring: LagreNyttVilkårReiseOppstartAvslutningHjemreise
    ) => Promise<RessursSuksess<VilkårReiseOppstartAvslutningHjemreise> | RessursFeilet>;
    avsluttRedigering: () => void;
}

export const EndreVilkårReiseOppstartAvslutningHjemreise: React.FC<Props> = ({
    vilkår,
    aktivitet,
    lagre,
    avsluttRedigering,
}) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { regelstruktur } = useVilkårReiseOppstartAvslutningHjemreise();
    const komponentId = useId();

    const [svar, settSvar] = useState<SvarVilkårReiseOppstartAvslutningHjemreise>(
        initierSvar(vilkår)
    );

    const [periode, settPeriode] = useState<Periode>({
        fom: vilkår?.fom || '',
        tom: vilkår?.tom || '',
    });

    const [reiseId] = useState<string>(vilkår?.reiseId || v7());
    const [typeReiseformål, settTypeReiseformål] = useState<TypeReiseformål | undefined>(
        vilkår?.typeReiseformål
    );
    const [valgtRegelstruktur, settValgtRegelstruktur] = useState<Regelstruktur | undefined>(
        finnRegelstrukturForReiseformål(regelstruktur, typeReiseformål)
    );

    const [gjeldendeFaktaType, settGjeldendeFaktaType] = useState<TypeVilkårFakta>(
        initierGjeldendeFaktaType(vilkår)
    );

    const [fakta, settFakta] = useState<FaktaReiseOppstartAvslutningHjemreise>(
        vilkår?.fakta || tomtUbestemtFakta
    );

    const [laster, settLaster] = useState(false);
    const [feilmeldingVedLagring, settFeilmeldingVedLagring] = useState<Feil | undefined>(
        undefined
    );

    const [feilmeldinger, settFeilmeldinger] =
        useState<FeilmeldingerReiseOppstartAvslutningHjemreise>(ingenFeil);

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

        const valideringsfeil = validerVilkår(
            typeReiseformål,
            periode,
            svar,
            fakta,
            valgtRegelstruktur
        );

        settFeilmeldinger(valideringsfeil);
        if (harValideringsFeil(valideringsfeil)) {
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

        const response = await lagre({
            fom: periode.fom,
            tom: periode.tom,
            aktivitetId: aktivitet.globalId,
            reiseId: reiseId,
            typeReiseformål: typeReiseformål as TypeReiseformål,
            svar: svar,
            fakta: fakta,
        });

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

    const oppdaterTypeReiseformål = (nyTypeReiseformål: TypeReiseformål | undefined) => {
        settTypeReiseformål(nyTypeReiseformål);
        settValgtRegelstruktur(finnRegelstrukturForReiseformål(regelstruktur, nyTypeReiseformål));
        settSvar(tomtSvar);
        settFakta(tomtUbestemtFakta);
        settGjeldendeFaktaType('REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT');
        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['typeReiseformål', 'begrunnelse', 'fakta']);
    };

    const oppdaterVurderinger = (nyeSvar: SvarVilkårReiseOppstartAvslutningHjemreise) => {
        settSvar(nyeSvar);
        settUlagretKomponent(komponentId);
        nullstillFeilmeldingFor(['begrunnelse', 'fakta']);
    };

    const oppdaterGjeldendeFaktaType = (nyGjeldendeFaktaType: TypeVilkårFakta) => {
        if (gjeldendeFaktaType !== nyGjeldendeFaktaType) {
            settFakta(tomtUbestemtFakta);
        }
        settGjeldendeFaktaType(nyGjeldendeFaktaType);
        nullstillFeilmeldingFor(['fakta']);
    };

    const nullstillFeilmeldingFor = (
        feltListe: Array<keyof FeilmeldingerReiseOppstartAvslutningHjemreise>
    ) => {
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
                    <FeilmeldingMaksBredde $maxWidth={200}>
                        <Select
                            label={'Reiseformål'}
                            size="small"
                            error={feilmeldinger?.typeReiseformål}
                            value={typeReiseformål || ''}
                            onChange={(e) => {
                                oppdaterTypeReiseformål(
                                    (e.target.value || undefined) as TypeReiseformål | undefined
                                );
                            }}
                        >
                            <option value="">Velg reiseformål</option>
                            {Object.entries(typeReiseformålTilTekst).map(([verdi, tekst]) => (
                                <option key={verdi} value={verdi}>
                                    {tekst}
                                </option>
                            ))}
                        </Select>
                    </FeilmeldingMaksBredde>
                    {typeReiseformål !== undefined && (
                        <FeilmeldingMaksBredde $maxWidth={152}>
                            <DateInputMedLeservisning
                                label={typeReiseformål === 'HJEMREISE' ? 'Fra' : 'Dato'}
                                value={periode.fom}
                                onChange={(dato) => {
                                    oppdaterPeriodeForVilkår('fom', dato);
                                    nullstillFeilmeldingFor(['fom']);
                                }}
                                size="small"
                                feil={feilmeldinger.fom}
                            />
                        </FeilmeldingMaksBredde>
                    )}
                    {typeReiseformål === 'HJEMREISE' && (
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
                    )}
                </HStack>
                <Skillelinje />
                {valgtRegelstruktur && (
                    <EndreVurderinger
                        regelstruktur={valgtRegelstruktur}
                        vurderinger={svar}
                        oppdaterVurderinger={oppdaterVurderinger}
                        oppdaterGjeldendeFaktaType={oppdaterGjeldendeFaktaType}
                        feilmeldinger={feilmeldinger}
                    />
                )}
                <Skillelinje />

                <EndreFaktaReiseOppstartAvslutningHjemreise
                    gjeldendeFaktaType={gjeldendeFaktaType}
                    fakta={fakta}
                    settFakta={settFakta}
                    nullstillFeilOgUlagretkomponent={nullstillFeilOgUlagretkomponent}
                    feilmeldinger={feilmeldinger}
                />

                <HStack justify="space-between">
                    <HStack gap="space-16">
                        <SmallButton>Lagre</SmallButton>
                        <SmallButton variant="secondary" onClick={handleAvsluttRedigering}>
                            Avbryt
                        </SmallButton>
                    </HStack>
                    <SlettVilkårReiseOppstartAvslutningHjemreise
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
