import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { HarBrukerRettTilUtstyrsstipend } from './Delvilkår/HarBrukerRettTilUtstyrsstipend';
import { HarBrukerUtgifterTilLæremidler } from './Delvilkår/HarBrukerUtgifterTilLæremidler';
import { DetaljerRegisterAktivitet } from './DetaljerRegisterAktivitet';
import { EndreStudienivå } from './EndreStudienivå';
import { valgbareAktivitetTyper } from './utilsAktivitet';
import {
    erUtdanningEllerTiltak,
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
import { feiletRessursTilFeilmelding, Feil } from '../../../../komponenter/Feil/feilmeldingUtils';
import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetLæremidler,
    AktivitetTypeLæremidler,
    Studienivå,
} from '../typer/vilkårperiode/aktivitetLæremidler';
import { KildeVilkårsperiode, SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
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

export interface VurderingerAktivitetLæremidler {
    svarHarUtgifter: SvarJaNei | undefined;
    svarHarRettTilUtstyrsstipend: SvarJaNei | undefined;
}

export interface EndreAktivitetFormLæremidler extends Periode {
    type: AktivitetTypeLæremidler | '';
    prosent: number | undefined;
    studienivå: Studienivå | undefined;
    vurderinger: VurderingerAktivitetLæremidler;
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
    const { oppdaterAktivitet, leggTilAktivitet } = useInngangsvilkår();
    const { lagreVilkårperiode } = useLagreVilkårperiode();

    const [form, settForm] = useState<EndreAktivitetFormLæremidler>(
        initaliserForm(aktivitet, aktivitetFraRegister)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
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

                        avbrytRedigering();
                    } else {
                        settFeilmelding(
                            feiletRessursTilFeilmelding(res, 'Feilet legg til periode')
                        );
                    }
                })
                .finally(() => settLaster(false));
        }
    };

    const oppdaterForm = (
        key: keyof EndreAktivitetFormLæremidler,
        nyVerdi: string | number | undefined
    ) => settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));

    const oppdaterType = (type: AktivitetTypeLæremidler) => {
        settForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const oppdaterVurdering =
        (key: keyof VurderingerAktivitetLæremidler) => (nyttSvar?: SvarJaNei) =>
            settForm((prevState) => ({
                ...prevState,
                vurderinger: { ...prevState.vurderinger, [key]: nyttSvar },
            }));

    const { alleFelterKanEndres, kanSlettePeriode } = useRevurderingAvPerioder({
        periodeFom: aktivitet?.fom,
        periodeTom: aktivitet?.tom,
        nyRadLeggesTil: nyRadLeggesTil,
    });

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerAktivitet(
        form.type,
        form.vurderinger
    );

    const aktivitetErBruktFraSystem = form.kildeId !== undefined;

    function defaultHarRettTilUtstyrsstipendSvar(studienivåSvar: Studienivå) {
        const alder =
            behandlingFakta['@type'] === Stønadstype.LÆREMIDLER ? behandlingFakta.alder : undefined;
        const søkerErOver21År = alder !== undefined && alder >= 21;
        if (studienivåSvar === Studienivå.VIDEREGÅENDE && søkerErOver21År) {
            return SvarJaNei.NEI;
        }
        return undefined;
    }

    return (
        <VilkårperiodeKortBase vilkårperiode={aktivitet} redigeres>
            <VStack gap={'4'}>
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
                    {erUtdanningEllerTiltak(form.type) && (
                        <FeilmeldingMaksBredde $maxWidth={140}>
                            <TextField
                                erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                                label="Prosent"
                                value={harTallverdi(form.prosent) ? form.prosent : ''}
                                onChange={(event) =>
                                    oppdaterForm('prosent', tilHeltall(event.target.value))
                                }
                                size="small"
                                error={vilkårsperiodeFeil?.prosent}
                                autoComplete="off"
                                readOnly={!alleFelterKanEndres}
                            />
                        </FeilmeldingMaksBredde>
                    )}
                </FeltContainer>
                <DetaljerRegisterAktivitet aktivitetFraRegister={aktivitetFraRegister} />
            </VStack>
            <HarBrukerUtgifterTilLæremidler
                aktivitetForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterSvar={oppdaterVurdering('svarHarUtgifter')}
                resettStudienivå={() => oppdaterForm('studienivå', undefined)}
                resettHarRettTilUtstyrsstipendSvar={() =>
                    oppdaterVurdering('svarHarRettTilUtstyrsstipend')(undefined)
                }
            />
            <EndreStudienivå
                form={form}
                settStudienivå={(studienivå) => oppdaterForm('studienivå', studienivå)}
                resettHarRettTilUtstyrsstipendSvar={(studienivåSvar: Studienivå) =>
                    oppdaterVurdering('svarHarRettTilUtstyrsstipend')(
                        defaultHarRettTilUtstyrsstipendSvar(studienivåSvar)
                    )
                }
                alleFelterKanEndres={alleFelterKanEndres}
                feil={vilkårsperiodeFeil}
            />
            <HarBrukerRettTilUtstyrsstipend
                aktivitetForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterSvar={oppdaterVurdering('svarHarRettTilUtstyrsstipend')}
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
                {aktivitet !== undefined && kanSlettePeriode && (
                    <SlettVilkårperiode
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={aktivitet}
                    />
                )}
            </HStack>

            <Feilmelding feil={feilmelding} />
        </VilkårperiodeKortBase>
    );
};
