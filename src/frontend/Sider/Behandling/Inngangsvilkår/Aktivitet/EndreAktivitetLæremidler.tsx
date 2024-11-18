import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import { AktivitetDelvilkårLæremidler } from './Delvilkår/AktivitetDelvilkårLæremidler';
import { Faktafelter } from './Fakta';
import { finnBegrunnelseGrunnerAktivitet, nyAktivitet, resettAktivitet } from './utilsLæremidler';
import { AktivitetValideringLæremidler, validerAktivitet } from './valideringAktivitetLæremidler';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { useTriggRerendringAvDateInput } from '../../../../hooks/useTriggRerendringAvDateInput';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import {
    Aktivitet,
    AktivitetLæremidlerNyttFormat,
    AktivitetType,
    aktivitetTypeOptions,
    DelvilkårAktivitetLæremidler,
    FaktaLæremidler,
    FaktaOgVurderinger,
    mapAktivitetLæremidlerNyToLæremidler,
} from '../typer/aktivitet';
import {
    KildeVilkårsperiode,
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
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

export interface EndreAktivitetForm extends Periode {
    behandlingId: string;
    type: AktivitetType | '';
    faktaOgVurderinger: FaktaOgVurderinger;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    behandlingId: string,
    eksisterendeAktivitet?: AktivitetLæremidlerNyttFormat,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetForm => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(behandlingId, aktivitetFraRegister)
        : { ...eksisterendeAktivitet, behandlingId: behandlingId };
};

export const EndreAktivitetLæremidler: React.FC<{
    aktivitet?: AktivitetLæremidlerNyttFormat;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister }) => {
    const { request } = useApp();
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    const [form, settForm] = useState<EndreAktivitetForm>(
        initaliserForm(behandling.id, aktivitet, aktivitetFraRegister)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<AktivitetValideringLæremidler>>();

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerAktivitet(form, aktivitet, behandling.revurderFra);
        settVilkårsperiodeFeil(vilkårsperiodeFeil);

        return isValid(vilkårsperiodeFeil);
    };

    const nyRadLeggesTil = aktivitet === undefined;

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settLaster(true);

            return request<LagreVilkårperiodeResponse<Aktivitet>, EndreAktivitetForm>(
                nyRadLeggesTil
                    ? `/api/sak/vilkarperiode`
                    : `/api/sak/vilkarperiode/${aktivitet.id}`,
                'POST',
                form
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        if (nyRadLeggesTil) {
                            leggTilAktivitet(res.data.periode);
                        } else {
                            oppdaterAktivitet(res.data.periode);
                        }

                        if (res.data.stønadsperiodeStatus === StønadsperiodeStatus.Ok) {
                            settStønadsperiodeFeil(undefined);
                        } else {
                            settStønadsperiodeFeil(res.data.stønadsperiodeFeil);
                        }
                        avbrytRedigering();
                    } else {
                        settFeilmelding(`Feilet legg til periode: ${res.frontendFeilmelding}`);
                    }
                })
                .finally(() => settLaster(false));
        }
    };

    //TODO: fiks
    const oppdaterForm = (key: keyof Aktivitet, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
        oppdaterFomDatoKey();
        oppdaterTomDatoKey();
    };

    const { alleFelterKanEndres } = useRevurderingAvPerioder({
        periodeFom: aktivitet?.fom,
        periodeTom: aktivitet?.tom,
        nyRadLeggesTil: nyRadLeggesTil,
    });

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerAktivitet(
        form.type,
        form.faktaOgVurderinger.vurderinger
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;
    const kanEndreType = aktivitet === undefined && !aktivitetErBruktFraSystem;

    const oppdaterVurdering = (nyVurdering: Vurdering, key: keyof DelvilkårAktivitetLæremidler) => {
        settForm((prevState) => ({
            ...prevState,
            faktaOgVurderinger: {
                ...prevState.faktaOgVurderinger,
                vurderinger: {
                    ...prevState.faktaOgVurderinger.vurderinger,
                    [key]: nyVurdering,
                },
            },
        }));
    };

    const oppdaterFakta = (key: keyof FaktaLæremidler, nyFakta?: number) => {
        settForm((prevState) => ({
            ...prevState,
            faktaOgVurderinger: {
                ...prevState.faktaOgVurderinger,
                fakta: {
                    ...prevState.faktaOgVurderinger.fakta,
                    [key]: nyFakta,
                },
            },
        }));
    };

    return (
        <VilkårperiodeKortBase
            vilkårperiode={mapAktivitetLæremidlerNyToLæremidler(aktivitet)}
            redigeres
        >
            <FeltContainer>
                <FeilmeldingMaksBredde>
                    <SelectMedOptions
                        label="Type"
                        readOnly={!kanEndreType}
                        value={form.type}
                        valg={aktivitetTypeOptions}
                        onChange={(e) => oppdaterType(e.target.value as AktivitetType)}
                        size="small"
                        error={vilkårsperiodeFeil?.type}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde>
                    <DateInputMedLeservisning
                        key={fomKeyDato}
                        erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                        readOnly={!alleFelterKanEndres}
                        label={'Fra'}
                        value={form?.fom}
                        onChange={(dato) => oppdaterForm('fom', dato || '')}
                        size="small"
                        feil={vilkårsperiodeFeil?.fom}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde>
                    <DateInputMedLeservisning
                        key={tomKeyDato}
                        erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                        label={'Til'}
                        value={form?.tom}
                        onChange={(dato) => oppdaterForm('tom', dato || '')}
                        size="small"
                        feil={vilkårsperiodeFeil?.tom}
                    />
                </FeilmeldingMaksBredde>
                {form.type !== AktivitetType.INGEN_AKTIVITET && (
                    <Faktafelter
                        fakta={form.faktaOgVurderinger.fakta}
                        errors={vilkårsperiodeFeil || {}}
                        oppdaterFakta={oppdaterFakta}
                        erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                        alleFelterKanEndres={alleFelterKanEndres}
                    />
                )}
            </FeltContainer>

            <AktivitetDelvilkårLæremidler
                aktivitetForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterDelvilkår={(
                    key: keyof DelvilkårAktivitetLæremidler,
                    vurdering: Vurdering
                ) => oppdaterVurdering(vurdering, key)}
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
                {aktivitet !== undefined && alleFelterKanEndres && (
                    <SlettVilkårperiode
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={mapAktivitetLæremidlerNyToLæremidler(aktivitet)!}
                    />
                )}
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};
