import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import { AktivitetDelvilkårLæremidler } from './Delvilkår/AktivitetDelvilkårLæremidler';
import { valgbareAktivitetTyper } from './utilsAktivitet';
import {
    finnBegrunnelseGrunnerAktivitet,
    mapEksisterendeAktivitet,
    mapFaktaOgSvarTilRequest,
    nyAktivitet,
    resettAktivitet,
} from './utilsLæremidler';
import { AktivitetValidering, validerAktivitet } from './valideringAktivitetLæremidler';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useLagreVilkårperiode } from '../../../../hooks/useLagreVilkårperiode';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetLæremidler,
    AktivitetTypeLæremidler,
} from '../typer/vilkårperiode/aktivitetLæremidler';
import {
    KildeVilkårsperiode,
    StønadsperiodeStatus,
    SvarJaNei,
} from '../typer/vilkårperiode/vilkårperiode';
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

export interface EndreAktivitetFormLæremidler extends Periode {
    type: AktivitetTypeLæremidler | '';
    prosent: number | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    begrunnelse?: string;
    kildeId?: string;
}

const initaliserForm = (
    eksisterendeAktivitet?: AktivitetLæremidler,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetFormLæremidler => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(aktivitetFraRegister)
        : mapEksisterendeAktivitet(eksisterendeAktivitet);
};

export const EndreAktivitetLæremidler: React.FC<{
    aktivitet?: AktivitetLæremidler;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister }) => {
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();
    const { lagreVilkårperiode } = useLagreVilkårperiode();

    const [form, settForm] = useState<EndreAktivitetFormLæremidler>(
        initaliserForm(aktivitet, aktivitetFraRegister)
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

    const oppdaterType = (type: AktivitetTypeLæremidler) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const { alleFelterKanEndres } = useRevurderingAvPerioder({
        periodeFom: aktivitet?.fom,
        periodeTom: aktivitet?.tom,
        nyRadLeggesTil: nyRadLeggesTil,
    });

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerAktivitet(
        form.type,
        form.svarHarUtgifter
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;

    return (
        <VilkårperiodeKortBase vilkårperiode={aktivitet} redigeres>
            <FeltContainer>
                <EndreTypeOgDatoer
                    form={form}
                    oppdaterTypeIForm={oppdaterType}
                    oppdaterPeriode={oppdaterForm}
                    typeOptions={valgbareAktivitetTyper(Stønadstype.LÆREMIDLER)}
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
                oppdaterHarUtgifter={(nyttSvar: SvarJaNei) =>
                    settForm((prevState) => ({
                        ...prevState,
                        svarHarUtgifter: nyttSvar,
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
