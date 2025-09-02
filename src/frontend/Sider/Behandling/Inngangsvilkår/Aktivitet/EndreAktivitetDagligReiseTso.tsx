import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { AktivitetDelvilkårDagligReiseTso } from './Delvilkår/AktivitetDelvilkårDagligReiseTso';
import { DetaljerRegisterAktivitet } from './DetaljerRegisterAktivitet';
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
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { AktivitetDagligReiseTso } from '../typer/vilkårperiode/aktivitetDagligReiseTso';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { EndreTypeOgDatoer } from '../Vilkårperioder/EndreTypeOgDatoer';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';
import VilkårperiodeKortBase from '../Vilkårperioder/VilkårperiodeKort/VilkårperiodeKortBase';

const FeltContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    align-self: start;
    align-items: start;
`;

export interface EndreAktivitetFormDagligReiseTso extends Periode {
    type: AktivitetType | '';
    svarLønnet: SvarJaNei | undefined;
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
        form.svarLønnet
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;

    return (
        <VilkårperiodeKortBase vilkårperiode={aktivitet} redigeres>
            <VStack gap={'4'}>
                <FeltContainer>
                    <EndreTypeOgDatoer
                        form={form}
                        oppdaterTypeIForm={oppdaterType}
                        oppdaterPeriode={oppdaterForm}
                        typeOptions={valgbareAktivitetTyper(Stønadstype.DAGLIG_REISE_TSO)}
                        formFeil={vilkårsperiodeFeil}
                        kanEndreType={aktivitet === undefined && !aktivitetErBruktFraSystem}
                    />
                </FeltContainer>
                <DetaljerRegisterAktivitet aktivitetFraRegister={aktivitetFraRegister} />
            </VStack>

            <AktivitetDelvilkårDagligReiseTso
                aktivitetForm={form}
                oppdaterLønnet={(svar) =>
                    settForm((prevState) => ({ ...prevState, svarLønnet: svar }))
                }
            />

            <Begrunnelse
                begrunnelse={form?.begrunnelse || ''}
                oppdaterBegrunnelse={(nyBegrunnelse) => oppdaterForm('begrunnelse', nyBegrunnelse)}
                delvilkårSomKreverBegrunnelse={delvilkårSomKreverBegrunnelse}
                feil={vilkårsperiodeFeil?.begrunnelse}
            />
            <HStack gap="4">
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
        </VilkårperiodeKortBase>
    );
};
