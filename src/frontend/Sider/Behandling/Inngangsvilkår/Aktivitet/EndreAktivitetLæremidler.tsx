import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import { AktivitetDelvilkårLæremidler } from './Delvilkår/AktivitetDelvilkårLæremidler';
import { EndreFellesFelter } from './EndreFellesFelter';
import { finnTingSomMåBegrunnes, nyAktivitet, resettAktivitet } from './utilsLæremidler';
import { AktivitetValidering, validerAktivitet } from './valideringAktivitetLæremidler';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import {
    Aktivitet,
    AktivitetLæremidler,
    AktivitetType,
    DelvilkårAktivitetLæremidler,
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

export interface EndreAktivitetFormLæremidler extends Periode {
    prosent?: number;
    behandlingId: string;
    type: AktivitetType | '';
    delvilkår: DelvilkårAktivitetLæremidler;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    behandlingId: string,
    eksisterendeAktivitet?: Aktivitet,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetFormLæremidler => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(behandlingId, aktivitetFraRegister)
        : { ...eksisterendeAktivitet, behandlingId: behandlingId };
};

export const EndreAktivitetLæremidler: React.FC<{
    aktivitet?: AktivitetLæremidler;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister }) => {
    const { request } = useApp();
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();

    const [form, settForm] = useState<EndreAktivitetFormLæremidler>(
        initaliserForm(behandling.id, aktivitet, aktivitetFraRegister)
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

            return request<LagreVilkårperiodeResponse<Aktivitet>, EndreAktivitetFormLæremidler>(
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
    const oppdaterForm = (key: keyof AktivitetLæremidler, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const { alleFelterKanEndres } = useRevurderingAvPerioder({
        periodeFom: aktivitet?.fom,
        periodeTom: aktivitet?.tom,
        nyRadLeggesTil: nyRadLeggesTil,
    });

    const delvilkårSomKreverBegrunnelse = finnTingSomMåBegrunnes(form.type);

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;

    return (
        <VilkårperiodeKortBase vilkårperiode={aktivitet} redigeres>
            <FeltContainer>
                <EndreFellesFelter
                    form={form}
                    oppdaterTypeIForm={oppdaterType}
                    oppdaterPeriode={oppdaterForm}
                    formFeil={vilkårsperiodeFeil}
                    alleFelterKanEndres={alleFelterKanEndres}
                    kanEndreType={aktivitet === undefined && !aktivitetErBruktFraSystem}
                />
                {form.type !== AktivitetType.INGEN_AKTIVITET && (
                    <FeilmeldingMaksBredde $maxWidth={140}>
                        <TextField
                            erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                            label="Prosent"
                            value={harTallverdi(form.prosent) ? form.prosent : ''}
                            onChange={(event) =>
                                settForm((prevState) => ({
                                    ...prevState,
                                    prosent: tilHeltall(event.target.value),
                                }))
                            }
                            size="small"
                            error={vilkårsperiodeFeil?.prosent}
                            autoComplete="off"
                            readOnly={!alleFelterKanEndres}
                        />
                    </FeilmeldingMaksBredde>
                )}
            </FeltContainer>

            <AktivitetDelvilkårLæremidler
                aktivitetForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterDelvilkår={(
                    key: keyof DelvilkårAktivitetLæremidler,
                    vurdering: Vurdering
                ) =>
                    settForm((prevState) => ({
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
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={aktivitet}
                    />
                )}
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};
