import React, { useState } from 'react';

import styled from 'styled-components';

import { Alert, Button, HStack, VStack } from '@navikt/ds-react';

import { DetaljerRegisterAktivitet } from './DetaljerRegisterAktivitet';
import { valgbareAktivitetTyper } from './utilsAktivitet';
import {
    finnBegrunnelseGrunnerAktivitet,
    finnTypeAktivitetForKode,
    mapEksisterendeAktivitet,
    mapFaktaOgSvarTilRequest,
    nyAktivitet,
    resettAktivitet,
} from './utilsDagligReiseTsr';
import { AktivitetValidering, validerAktivitet } from './valideringAktivitetDagligReiseTsr';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useLagreVilkårperiode } from '../../../../hooks/useLagreVilkårperiode';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Kodeverk } from '../../../../typer/kodeverk';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { AktivitetDagligReiseTsr } from '../typer/vilkårperiode/aktivitetDagligReiseTsr';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { EndreTypeOgDatoer } from '../Vilkårperioder/EndreTypeOgDatoer';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';

const FeltContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    align-self: start;
    align-items: start;
`;

export interface EndreAktivitetFormDagligReiseTsr extends Periode {
    type: AktivitetType | '';
    typeAktivitet?: Kodeverk;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    typeAktivitetValg: Kodeverk[],
    eksisterendeAktivitet?: AktivitetDagligReiseTsr,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetFormDagligReiseTsr => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(aktivitetFraRegister, typeAktivitetValg)
        : mapEksisterendeAktivitet(eksisterendeAktivitet);
};

export const EndreAktivitetDagligReiseTsr: React.FC<{
    aktivitet?: AktivitetDagligReiseTsr;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
    typeAktivitetValg: Kodeverk[];
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister, typeAktivitetValg }) => {
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet } = useInngangsvilkår();
    const { lagreVilkårperiode } = useLagreVilkårperiode();

    const [form, settForm] = useState<EndreAktivitetFormDagligReiseTsr>(
        initaliserForm(typeAktivitetValg, aktivitet, aktivitetFraRegister)
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
            mapFaktaOgSvarTilRequest(),
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

    const oppdaterForm = (key: keyof EndreAktivitetFormDagligReiseTsr, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const oppdaterTypeAktivitet = (typeAktivitetString: string) => {
        const typeAktivitet = finnTypeAktivitetForKode(typeAktivitetString, typeAktivitetValg);
        settForm((prevState) => ({ ...prevState, ['typeAktivitet']: typeAktivitet }));
    };

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerAktivitet(form.type);

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;

    function typeAktivitetValgTilOptions(typeAktivitetValg: Kodeverk[]): SelectOption[] {
        return typeAktivitetValg.map((typeAktivitet) => ({
            value: typeAktivitet.kode,
            label: typeAktivitet.beskrivelse,
        }));
    }

    const fantIkkeTypeAktivitet = aktivitetFraRegister && form?.typeAktivitet === undefined;

    return (
        <ResultatOgStatusKort periode={aktivitet} redigeres>
            {fantIkkeTypeAktivitet && (
                <Alert variant={'error'}>
                    {`Klarte ikke å opprette aktivitet med tiltaksvariant "${aktivitetFraRegister.typeNavn}". Ta kontakt med utviklerteamet.`}
                </Alert>
            )}
            <VStack gap={'4'}>
                <FeltContainer>
                    <EndreTypeOgDatoer
                        form={form}
                        oppdaterTypeIForm={oppdaterType}
                        oppdaterPeriode={oppdaterForm}
                        oppdaterTypeAktivitet={oppdaterTypeAktivitet}
                        typeOptions={valgbareAktivitetTyper(Stønadstype.DAGLIG_REISE_TSR)}
                        typeAktivitetOptions={typeAktivitetValgTilOptions(typeAktivitetValg)}
                        formFeil={vilkårsperiodeFeil}
                        kanEndreTypeAktivitet={
                            aktivitet === undefined && !aktivitetErBruktFraSystem
                        }
                        kanEndreType={aktivitet === undefined && !aktivitetErBruktFraSystem}
                    />
                </FeltContainer>
                <DetaljerRegisterAktivitet aktivitetFraRegister={aktivitetFraRegister} />
            </VStack>

            <Begrunnelse
                begrunnelse={form?.begrunnelse || ''}
                oppdaterBegrunnelse={(nyBegrunnelse) => oppdaterForm('begrunnelse', nyBegrunnelse)}
                delvilkårSomKreverBegrunnelse={delvilkårSomKreverBegrunnelse}
                feil={vilkårsperiodeFeil?.begrunnelse}
            />
            <HStack gap="4">
                <Button size="xsmall" onClick={lagre} disabled={fantIkkeTypeAktivitet}>
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
