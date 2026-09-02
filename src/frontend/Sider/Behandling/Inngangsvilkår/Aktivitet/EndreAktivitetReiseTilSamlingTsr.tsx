import React, { useState } from 'react';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { AktivitetDelvilkårReiseTilSamlingTsr } from './Delvilkår/AktivitetDelvilkårReiseTilSamlingTsr';
import { DetaljerRegisterAktivitet } from './DetaljerRegisterAktivitet';
import styles from './EndreAktivitetReiseTilSamlingTsr.module.css';
import { valgbareAktivitetTyper } from './utilsAktivitet';
import {
    finnBegrunnelseGrunnerAktivitet,
    finnTiltaksvariantForKode,
    mapEksisterendeAktivitet,
    mapFaktaOgSvarTilRequest,
    nyAktivitet,
    resettAktivitet,
} from './utilsReiseTilSamlingTsr';
import { AktivitetValidering, validerAktivitet } from './valideringAktivitetReiseTilSamlingTsr';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useLagreVilkårperiode } from '../../../../hooks/useLagreVilkårperiode';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Kodeverk, kodeverkTilOptions } from '../../../../typer/kodeverk';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { AktivitetReiseTilSamlingTsr } from '../typer/vilkårperiode/aktivitetReiseTilSamlingTsr';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { EndreTypeOgDatoer } from '../Vilkårperioder/EndreTypeOgDatoer';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';

export interface EndreAktivitetFormReiseTilSamlingTsr extends Periode {
    type: AktivitetType | '';
    tiltaksvariant?: Kodeverk;
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
    aktivitetsdager: number | undefined;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    eksisterendeAktivitet?: AktivitetReiseTilSamlingTsr,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetFormReiseTilSamlingTsr => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(aktivitetFraRegister)
        : mapEksisterendeAktivitet(eksisterendeAktivitet);
};

export const EndreAktivitetReiseTilSamlingTsr: React.FC<{
    aktivitet?: AktivitetReiseTilSamlingTsr;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
    tiltaksvariantValg: Kodeverk[];
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister, tiltaksvariantValg }) => {
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet } = useInngangsvilkår();
    const { lagreVilkårperiode } = useLagreVilkårperiode();

    const [form, settForm] = useState<EndreAktivitetFormReiseTilSamlingTsr>(
        initaliserForm(aktivitet, aktivitetFraRegister)
    );

    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<AktivitetValidering>>();
    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useHarEndretDatoerFørTidligereVedtak({
            tidligere: aktivitet,
            ny: form,
        });

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerAktivitet(form);
        settVilkårsperiodeFeil(vilkårsperiodeFeil);

        return isValid(vilkårsperiodeFeil);
    };

    const nyRadLeggesTil = aktivitet === undefined;

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);
        if (!validerForm()) {
            return;
        }
        if (burdeViseModal) {
            settVisBekreftModal(true);
            return;
        }
        bekreftLagre();
    };

    const bekreftLagre = () => {
        settLaster(true);

        const response = lagreVilkårperiode<Aktivitet>(
            behandling.id,
            form,
            mapFaktaOgSvarTilRequest(form),
            aktivitet?.id
        );

        return response
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    if (nyRadLeggesTil) {
                        leggTilAktivitet(res.data.periode);
                    } else {
                        oppdaterAktivitet(res.data.periode);
                    }

                    avbrytRedigering();
                } else {
                    settFeilmelding(feiletRessursTilFeilmelding(res, 'Feilet legg til periode'));
                }
            })
            .finally(() => settLaster(false));
    };

    const oppdaterForm = (key: keyof EndreAktivitetFormReiseTilSamlingTsr, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const oppdaterTiltaksvariant = (tiltaksvariantString: string) => {
        const tiltaksvariant = finnTiltaksvariantForKode(tiltaksvariantString, tiltaksvariantValg);
        settForm((prevState) => ({ ...prevState, tiltaksvariant }));
    };

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerAktivitet(
        form.type,
        form.svarLønnet,
        form.svarHarUtgifter,
        form.svarErAktivitetenObligatorisk
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;

    return (
        <ResultatOgStatusKort periode={aktivitet} redigeres>
            <VStack gap={'space-16'}>
                <div className={styles.feltContainer}>
                    <EndreTypeOgDatoer
                        form={form}
                        oppdaterTypeIForm={oppdaterType}
                        oppdaterPeriode={oppdaterForm}
                        oppdaterTiltaksvariant={oppdaterTiltaksvariant}
                        typeOptions={valgbareAktivitetTyper(Stønadstype.REISE_TIL_SAMLING_TSR)}
                        tiltaksvariantOptions={kodeverkTilOptions(tiltaksvariantValg)}
                        formFeil={vilkårsperiodeFeil}
                        kanEndreTiltaksvariant={
                            aktivitet === undefined && !aktivitetErBruktFraSystem
                        }
                        kanEndreType={aktivitet === undefined && !aktivitetErBruktFraSystem}
                    />
                    {form.type !== AktivitetType.INGEN_AKTIVITET && (
                        <FeilmeldingMaksBredde $maxWidth={140}>
                            <TextField
                                label="Aktivitetsdager"
                                value={
                                    harTallverdi(form.aktivitetsdager) ? form.aktivitetsdager : ''
                                }
                                onChange={(event) =>
                                    settForm((prevState) => ({
                                        ...prevState,
                                        aktivitetsdager: tilHeltall(event.target.value),
                                    }))
                                }
                                size="small"
                                error={vilkårsperiodeFeil?.aktivitetsdager}
                            />
                        </FeilmeldingMaksBredde>
                    )}
                </div>
                <DetaljerRegisterAktivitet aktivitetFraRegister={aktivitetFraRegister} />
            </VStack>
            <AktivitetDelvilkårReiseTilSamlingTsr
                aktivitetForm={form}
                oppdaterLønnet={(svar) =>
                    settForm((prevState) => ({ ...prevState, svarLønnet: svar }))
                }
                oppdaterHarUtgifter={(svar) =>
                    settForm((prevState) => ({ ...prevState, svarHarUtgifter: svar }))
                }
                oppdaterErObligatorisk={(svar) =>
                    settForm((prevState) => ({
                        ...prevState,
                        svarErAktivitetenObligatorisk: svar,
                    }))
                }
            />
            <Begrunnelse
                begrunnelse={form?.begrunnelse || ''}
                oppdaterBegrunnelse={(nyBegrunnelse) => oppdaterForm('begrunnelse', nyBegrunnelse)}
                begrunnelseGrunner={delvilkårSomKreverBegrunnelse}
                feil={vilkårsperiodeFeil?.begrunnelse}
            />
            <HStack gap="space-16">
                <Button size="xsmall" onClick={lagre}>
                    Lagre
                </Button>
                <Button onClick={avbrytRedigering} variant="secondary" size="xsmall">
                    Avbryt
                </Button>
                {aktivitet !== undefined && (
                    <SlettVilkårperiode
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={aktivitet}
                    />
                )}
            </HStack>
            <Feilmelding feil={feilmelding} />
            <BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal
                visBekreftModal={visBekreftModal}
                settVisBekreftModal={settVisBekreftModal}
                bekreftLagre={bekreftLagre}
                laster={laster}
            />
        </ResultatOgStatusKort>
    );
};
