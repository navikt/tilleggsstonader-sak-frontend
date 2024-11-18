import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import { AktivitetDelvilkårFelles } from './Delvilkår/AktivitetDelvilkårFelles';
import { Faktafelter } from './Fakta';
import { AktivitetValidering } from './valideringAktivitet';
import { AktivitetValideringLæremidler } from './valideringAktivitetLæremidler';
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
    AktivitetNyttFormat,
    AktivitetType,
    aktivitetTypeOptions,
    FaktaOgVurderinger,
    VurderingAktivitet,
} from '../typer/aktivitet';
import {
    KildeVilkårsperiode,
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';
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

export interface EndreAktivitetForm<T extends FaktaOgVurderinger> extends Periode {
    behandlingId: string;
    type: AktivitetType | '';
    faktaOgVurderinger: T;
    begrunnelse?: string;
    kildeId?: string;
}

export const EndreAktivitetFelles: React.FC<{
    aktivitet?: AktivitetNyttFormat;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
    nyAktivitet: (
        behandlingId: string,
        aktivitetFraRegister: Registeraktivitet | undefined
    ) => EndreAktivitetForm<FaktaOgVurderinger>;
    validerAktivitet: (
        endretAktitivitet: EndreAktivitetForm<FaktaOgVurderinger>,
        lagretAkvitet?: AktivitetNyttFormat | undefined,
        revurderesFraDato?: string
    ) => FormErrors<AktivitetValideringLæremidler>;
    resettAktivitet: (
        nyType: AktivitetType,
        eksisterendeAktivitetForm: EndreAktivitetForm<FaktaOgVurderinger>,
        søknadMottattTidspunkt?: string
    ) => EndreAktivitetForm<FaktaOgVurderinger>;
    finnBegrunnelsesGrunner: (
        type: AktivitetType | '',
        delvilkår: VurderingAktivitet
    ) => BegrunnelseGrunner[];
    mapNyTilGamme: (aktivitetGammeltFormat?: AktivitetNyttFormat) => Aktivitet;
}> = ({
    aktivitet,
    avbrytRedigering,
    aktivitetFraRegister,
    nyAktivitet,
    validerAktivitet,
    resettAktivitet,
    finnBegrunnelsesGrunner,
    mapNyTilGamme,
}) => {
    const { request } = useApp();
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    const [form, settForm] = useState<EndreAktivitetForm<FaktaOgVurderinger>>(
        aktivitet === undefined
            ? nyAktivitet(behandling.id, aktivitetFraRegister)
            : { ...aktivitet, behandlingId: behandling.id }
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<AktivitetValidering>>();

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

            return request<
                LagreVilkårperiodeResponse<Aktivitet>,
                EndreAktivitetForm<FaktaOgVurderinger>
            >(
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

    const delvilkårSomKreverBegrunnelse = finnBegrunnelsesGrunner(
        form.type,
        form.faktaOgVurderinger.vurderinger
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;
    const kanEndreType = aktivitet === undefined && !aktivitetErBruktFraSystem;

    const oppdaterVurdering = <T extends VurderingAktivitet, K extends keyof T>(
        key: K,
        nyVurdering: Vurdering
    ) => {
        // @ts-ignore
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

    const oppdaterFakta = <T extends VurderingAktivitet, K extends keyof T>(
        key: K,
        nyFakta?: number
    ) => {
        // @ts-ignore
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
        <VilkårperiodeKortBase vilkårperiode={mapNyTilGamme(aktivitet)} redigeres>
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

            {Object.entries(form.faktaOgVurderinger.vurderinger).map(([key, vurdering]) => (
                <AktivitetDelvilkårFelles
                    key={key}
                    label={'Hei og hå'}
                    type={form.type}
                    vurdering={vurdering}
                    vurderingKey={key as keyof VurderingAktivitet}
                    readOnly={!alleFelterKanEndres}
                    oppdaterDelvilkår={(key: keyof VurderingAktivitet, vurdering: Vurdering) =>
                        oppdaterVurdering(key, vurdering)
                    }
                />
            ))}
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
                        vilkårperiode={mapNyTilGamme(aktivitet)!}
                    />
                )}
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};
