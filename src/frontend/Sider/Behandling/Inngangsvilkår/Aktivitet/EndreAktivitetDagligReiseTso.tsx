import React, { useState } from 'react';

import { Button, HStack, TextField, VStack } from '@navikt/ds-react';

import { AktivitetDelvilkårDagligReiseTso } from './Delvilkår/AktivitetDelvilkårDagligReiseTso';
import { DetaljerRegisterAktivitet } from './DetaljerRegisterAktivitet';
import styles from './EndreAktivitetDagligReiseTso.module.css';
import { valgbareAktivitetTyper } from './utilsAktivitet';
import {
    finnBegrunnelseGrunnerAktivitet,
    mapEksisterendeAktivitet,
    mapFaktaOgSvarTilRequest,
    nyAktivitet,
    resettAktivitet,
} from './utilsDagligReiseTso';
import { AktivitetValidering, validerAktivitet } from './valideringAktivitetDagligReiseTso';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useLagreVilkårperiode } from '../../../../hooks/useLagreVilkårperiode';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { AktivitetDagligReiseTso } from '../typer/vilkårperiode/aktivitetDagligReiseTso';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { EndreTypeOgDatoer } from '../Vilkårperioder/EndreTypeOgDatoer';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';

export interface EndreAktivitetFormDagligReiseTso extends Periode {
    type: AktivitetType | '';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    aktivitetsdager: number | undefined;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    eksisterendeAktivitet?: AktivitetDagligReiseTso,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetFormDagligReiseTso => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(aktivitetFraRegister)
        : mapEksisterendeAktivitet(eksisterendeAktivitet);
};

export const EndreAktivitetDagligReiseTso: React.FC<{
    aktivitet?: AktivitetDagligReiseTso;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister }) => {
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet } = useInngangsvilkår();
    const { lagreVilkårperiode } = useLagreVilkårperiode();

    const [form, settForm] = useState<EndreAktivitetFormDagligReiseTso>(
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

    const oppdaterForm = (key: keyof AktivitetDagligReiseTso, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerAktivitet(
        form.type,
        form.svarLønnet,
        form.svarHarUtgifter
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
                        typeOptions={valgbareAktivitetTyper(Stønadstype.DAGLIG_REISE_TSO)}
                        formFeil={vilkårsperiodeFeil}
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
            <AktivitetDelvilkårDagligReiseTso
                aktivitetForm={form}
                oppdaterLønnet={(svar) =>
                    settForm((prevState) => ({ ...prevState, svarLønnet: svar }))
                }
                oppdaterHarUtgifter={(svar) =>
                    settForm((prevState) => ({ ...prevState, svarHarUtgifter: svar }))
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
