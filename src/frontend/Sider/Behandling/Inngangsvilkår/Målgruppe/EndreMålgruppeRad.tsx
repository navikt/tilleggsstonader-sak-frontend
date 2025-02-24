import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import MålgruppeVilkår from './MålgruppeVilkår';
import {
    finnBegrunnelseGrunnerMålgruppe,
    mapEksisterendeMålgruppe,
    mapFaktaOgSvarTilRequest,
    nyMålgruppe,
    resettMålgruppe,
} from './utils';
import { MålgruppeValidering, validerMålgruppe } from './valideringMålgruppe';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useLagreVilkårperiode } from '../../../../hooks/useLagreVilkårperiode';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import {
    feiletRessursTilFeilmelding,
    Feil,
    lagFeilmelding,
} from '../../../../komponenter/Feil/feilmeldingUtils';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { PeriodeYtelseRegister } from '../../../../typer/registerytelser';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import {
    Målgruppe,
    MålgruppeType,
    målgruppeTypeOptionsForStønad,
    SvarMålgruppe,
} from '../typer/vilkårperiode/målgruppe';
import { StønadsperiodeStatus, SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { EndreTypeOgDatoer } from '../Vilkårperioder/EndreTypeOgDatoer';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';
import VilkårperiodeKortBase from '../Vilkårperioder/VilkårperiodeKort/VilkårperiodeKortBase';

export interface EndreMålgruppeForm extends Periode {
    type: MålgruppeType | '';
    begrunnelse?: string;
    vurderinger: SvarMålgruppe;
}

const FeltContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    align-self: start;
    align-items: start;
`;

const initaliserForm = (
    eksisterendeMålgruppe?: Målgruppe,
    registrertYtelsePeriode?: PeriodeYtelseRegister
): EndreMålgruppeForm => {
    return eksisterendeMålgruppe === undefined
        ? nyMålgruppe(registrertYtelsePeriode)
        : mapEksisterendeMålgruppe(eksisterendeMålgruppe);
};

// TODO: Endre navn til EndreMålgruppe
const EndreMålgruppeRad: React.FC<{
    målgruppe?: Målgruppe;
    registerYtelsePeriode?: PeriodeYtelseRegister;
    avbrytRedigering: () => void;
}> = ({ målgruppe, avbrytRedigering, registerYtelsePeriode }) => {
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterMålgruppe, leggTilMålgruppe, settStønadsperiodeFeil } = useInngangsvilkår();
    const { lagreVilkårperiode } = useLagreVilkårperiode();

    const [form, settForm] = useState<EndreMålgruppeForm>(
        initaliserForm(målgruppe, registerYtelsePeriode)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<MålgruppeValidering>>();

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerMålgruppe(
        form.type,
        form.vurderinger
    );
    const kanEndreType = målgruppe === undefined && registerYtelsePeriode === undefined;

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerMålgruppe(form, målgruppe, behandling.revurderFra);
        settVilkårsperiodeFeil(vilkårsperiodeFeil);

        return isValid(vilkårsperiodeFeil);
    };

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settLaster(true);

            const erNyPeriode = målgruppe === undefined;

            const response = lagreVilkårperiode<Målgruppe>(
                behandling.id,
                form,
                mapFaktaOgSvarTilRequest(form),
                målgruppe?.id
            );
            return response
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        if (erNyPeriode) {
                            leggTilMålgruppe(res.data.periode);
                        } else {
                            oppdaterMålgruppe(res.data.periode);
                        }
                        if (res.data.stønadsperiodeStatus === StønadsperiodeStatus.Ok) {
                            settStønadsperiodeFeil(undefined);
                        } else if (res.data.stønadsperiodeFeil) {
                            settStønadsperiodeFeil(lagFeilmelding(res.data.stønadsperiodeFeil));
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

    const oppdaterForm = (key: keyof Målgruppe, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: MålgruppeType) => {
        settForm((prevState) =>
            resettMålgruppe(
                behandling.stønadstype,
                type,
                prevState,
                behandlingFakta.søknadMottattTidspunkt
            )
        );
    };

    const { alleFelterKanEndres, kanSlettePeriode } = useRevurderingAvPerioder({
        periodeFom: målgruppe?.fom,
        periodeTom: målgruppe?.tom,
        nyRadLeggesTil: !målgruppe,
    });

    const målgruppeTyperForStønadstype = (stønadstype: Stønadstype): SelectOption[] =>
        [Stønadstype.BARNETILSYN, Stønadstype.LÆREMIDLER].includes(stønadstype)
            ? målgruppeTypeOptionsForStønad(stønadstype)
            : [];

    return (
        <VilkårperiodeKortBase vilkårperiode={målgruppe} redigeres>
            <FeltContainer>
                <EndreTypeOgDatoer
                    form={form}
                    oppdaterTypeIForm={oppdaterType}
                    oppdaterPeriode={oppdaterForm}
                    typeOptions={målgruppeTyperForStønadstype(behandling.stønadstype)}
                    formFeil={vilkårsperiodeFeil}
                    alleFelterKanEndres={alleFelterKanEndres}
                    kanEndreType={kanEndreType}
                />
            </FeltContainer>

            <MålgruppeVilkår
                målgruppeForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterVurderinger={(key: keyof SvarMålgruppe, nyttSvar: SvarJaNei) =>
                    settForm((prevState) => ({
                        ...prevState,
                        vurderinger: { ...prevState.vurderinger, [key]: nyttSvar },
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
                {målgruppe !== undefined && kanSlettePeriode && (
                    <SlettVilkårperiode
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={målgruppe}
                    />
                )}
            </HStack>

            <Feilmelding feil={feilmelding} />
        </VilkårperiodeKortBase>
    );
};

export default EndreMålgruppeRad;
