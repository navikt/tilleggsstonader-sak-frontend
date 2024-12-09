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
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { PeriodeYtelseRegister } from '../../../../typer/registerytelser';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import {
    Målgruppe,
    MålgruppeType,
    målgruppeTypeOptions,
    målgruppeTypeOptionsForLæremidler,
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
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<MålgruppeValidering>>();

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerMålgruppe(
        form.type,
        form.vurderinger
    );
    const kanEndreType = målgruppe === undefined;

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

    const oppdaterForm = (key: keyof Målgruppe, nyVerdi: string) => {
        settForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: MålgruppeType) => {
        settForm((prevState) =>
            resettMålgruppe(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
    };

    const { alleFelterKanEndres } = useRevurderingAvPerioder({
        periodeFom: målgruppe?.fom,
        periodeTom: målgruppe?.tom,
        nyRadLeggesTil: !målgruppe,
    });

    return (
        <VilkårperiodeKortBase vilkårperiode={målgruppe} redigeres>
            <FeltContainer>
                <EndreTypeOgDatoer
                    form={form}
                    oppdaterTypeIForm={oppdaterType}
                    oppdaterPeriode={oppdaterForm}
                    typeOptions={
                        behandling.stønadstype === Stønadstype.LÆREMIDLER
                            ? målgruppeTypeOptionsForLæremidler
                            : målgruppeTypeOptions
                    }
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
                {målgruppe !== undefined && alleFelterKanEndres && (
                    <SlettVilkårperiode
                        avbrytRedigering={avbrytRedigering}
                        vilkårperiode={målgruppe}
                    />
                )}
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};

export default EndreMålgruppeRad;
