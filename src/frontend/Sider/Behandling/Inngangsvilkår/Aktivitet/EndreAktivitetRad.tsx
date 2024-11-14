import React, { useState } from 'react';

import styled from 'styled-components';

import { HStack, Button } from '@navikt/ds-react';

import AktivitetVilkår from './AktivitetVilkår';
import { finnBegrunnelseGrunnerAktivitet, nyAktivitet, resettAktivitet } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { useTriggRerendringAvDateInput } from '../../../../hooks/useTriggRerendringAvDateInput';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../komponenter/Skjema/SelectMedOptions';
import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import {
    Aktivitet,
    AktivitetType,
    aktivitetTypeOptions,
    DelvilkårAktivitet,
} from '../typer/aktivitet';
import {
    KildeVilkårsperiode,
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/EndreVilkårperiode/Begrunnelse';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';
import { EndreVilkårsperiode, validerVilkårsperiode } from '../Vilkårperioder/validering';
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
    aktivitetsdager?: number;
    behandlingId: string;
    type: AktivitetType | '';
    delvilkår: DelvilkårAktivitet;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    behandlingId: string,
    eksisterendeAktivitet?: Aktivitet,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetForm => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(behandlingId, aktivitetFraRegister)
        : { ...eksisterendeAktivitet, behandlingId: behandlingId };
};

// TODO: Rename til EndreAktivitet
const EndreAktivitetRad: React.FC<{
    aktivitet?: Aktivitet;
    avbrytRedigering: () => void;
    aktivitetFraRegister?: Registeraktivitet;
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister }) => {
    const { request } = useApp();
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    const [form, settAktivitetForm] = useState<EndreAktivitetForm>(
        initaliserForm(behandling.id, aktivitet, aktivitetFraRegister)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<EndreVilkårsperiode>>();

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerVilkårsperiode(form, aktivitet, behandling.revurderFra);
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
        settAktivitetForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settAktivitetForm((prevState) =>
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
        form.delvilkår
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;
    const kanEndreType = aktivitet === undefined && !aktivitetErBruktFraSystem;

    return (
        <VilkårperiodeKortBase vilkårperiode={aktivitet} redigeres>
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
                    <FeilmeldingMaksBredde $maxWidth={140}>
                        <TextField
                            erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                            label="Aktivitetsdager"
                            value={harTallverdi(form.aktivitetsdager) ? form.aktivitetsdager : ''}
                            onChange={(event) =>
                                settAktivitetForm((prevState) => ({
                                    ...prevState,
                                    aktivitetsdager: tilHeltall(event.target.value),
                                }))
                            }
                            size="small"
                            error={vilkårsperiodeFeil?.aktivitetsdager}
                            autoComplete="off"
                            readOnly={!alleFelterKanEndres}
                        />
                    </FeilmeldingMaksBredde>
                )}
            </FeltContainer>

            <AktivitetVilkår
                aktivitetForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterDelvilkår={(key: keyof DelvilkårAktivitet, vurdering: Vurdering) =>
                    settAktivitetForm((prevState) => ({
                        ...prevState,
                        delvilkår: { ...prevState.delvilkår, [key]: vurdering },
                    }))
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
                {aktivitet !== undefined && alleFelterKanEndres && (
                    <SlettVilkårperiode
                        type="Aktivitet"
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={aktivitet}
                    />
                )}
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};

export default EndreAktivitetRad;
