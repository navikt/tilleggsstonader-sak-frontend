import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import MålgruppeVilkår from './MålgruppeVilkår';
import { finnBegrunnelseGrunnerMålgruppe, nyMålgruppe, resettMålgruppe } from './utils';
import { MålgruppeValidering, validerMålgruppe } from './valideringMålgruppe';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { PeriodeYtelseRegister } from '../../../../typer/registerytelser';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import {
    DelvilkårMålgruppe,
    Målgruppe,
    MålgruppeType,
    målgruppeTypeOptions,
} from '../typer/målgruppe';
import {
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import Begrunnelse from '../Vilkårperioder/Begrunnelse/Begrunnelse';
import { EndreTypeOgDatoer } from '../Vilkårperioder/EndreTypeOgDatoer';
import SlettVilkårperiode from '../Vilkårperioder/SlettVilkårperiodeModal';
import VilkårperiodeKortBase from '../Vilkårperioder/VilkårperiodeKort/VilkårperiodeKortBase';

export interface EndreMålgruppeForm extends Periode {
    behandlingId: string;
    type: MålgruppeType | '';
    delvilkår: DelvilkårMålgruppe;
    begrunnelse?: string;
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
    behandlingId: string,
    eksisterendeMålgruppe?: Målgruppe,
    registrertYtelsePeriode?: PeriodeYtelseRegister
) => {
    return eksisterendeMålgruppe === undefined
        ? nyMålgruppe(behandlingId, registrertYtelsePeriode)
        : { ...eksisterendeMålgruppe, behandlingId: behandlingId };
};

// TODO: Endre navn til EndreMålgruppe
const EndreMålgruppeRad: React.FC<{
    målgruppe?: Målgruppe;
    registerYtelsePeriode?: PeriodeYtelseRegister;
    avbrytRedigering: () => void;
}> = ({ målgruppe, avbrytRedigering, registerYtelsePeriode }) => {
    const { request } = useApp();
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterMålgruppe, leggTilMålgruppe, settStønadsperiodeFeil } = useInngangsvilkår();

    const [form, settForm] = useState<EndreMålgruppeForm>(
        initaliserForm(behandling.id, målgruppe, registerYtelsePeriode)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<MålgruppeValidering>>();

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunnerMålgruppe(
        form.type,
        form.delvilkår
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

            return request<LagreVilkårperiodeResponse<Målgruppe>, EndreMålgruppeForm>(
                erNyPeriode ? `/api/sak/vilkarperiode` : `/api/sak/vilkarperiode/${målgruppe.id}`,
                'POST',
                form
            )
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
                    typeOptions={målgruppeTypeOptions}
                    formFeil={vilkårsperiodeFeil}
                    alleFelterKanEndres={alleFelterKanEndres}
                    kanEndreType={kanEndreType}
                />
            </FeltContainer>

            <MålgruppeVilkår
                målgruppeForm={form}
                readOnly={!alleFelterKanEndres}
                oppdaterDelvilkår={(key: keyof DelvilkårMålgruppe, vurdering: Vurdering) =>
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
