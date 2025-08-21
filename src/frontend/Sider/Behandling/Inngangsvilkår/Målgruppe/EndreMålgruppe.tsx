import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import MålgruppeDelvilkår from './MålgruppeDelvilkår';
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
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { feiletRessursTilFeilmelding, Feil } from '../../../../komponenter/Feil/feilmeldingUtils';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import {
    Målgruppe,
    MålgruppeType,
    målgruppeTypeOptionsForStønad,
    SvarMålgruppe,
} from '../typer/vilkårperiode/målgruppe';
import { SvarJaNei, YtelseGrunnlagPeriode } from '../typer/vilkårperiode/vilkårperiode';
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
    registrertYtelsePeriode?: YtelseGrunnlagPeriode
): EndreMålgruppeForm => {
    return eksisterendeMålgruppe === undefined
        ? nyMålgruppe(registrertYtelsePeriode)
        : mapEksisterendeMålgruppe(eksisterendeMålgruppe);
};

const EndreMålgruppe: React.FC<{
    målgruppe?: Målgruppe;
    registerYtelsePeriode?: YtelseGrunnlagPeriode;
    avbrytRedigering: () => void;
}> = ({ målgruppe, avbrytRedigering, registerYtelsePeriode }) => {
    const { behandling, behandlingFakta } = useBehandling();
    const {
        oppdaterMålgruppe,
        leggTilMålgruppe,
        målgrupper: lagredeMålgrupper,
    } = useInngangsvilkår();
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
        const vilkårsperiodeFeil = validerMålgruppe(form, målgruppe, lagredeMålgrupper);
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

    const målgruppeTyperForStønadstype = (stønadstype: Stønadstype): SelectOption[] =>
        [
            Stønadstype.BARNETILSYN,
            Stønadstype.LÆREMIDLER,
            Stønadstype.BOUTGIFTER,
            Stønadstype.DAGLIG_REISE_TSO,
            Stønadstype.DAGLIG_REISE_TSR,
        ].includes(stønadstype)
            ? målgruppeTypeOptionsForStønad(stønadstype)
            : [];

    const erMålgruppeSomStøttes = form.type !== MålgruppeType.GJENLEVENDE_GAMMELT_REGELVERK;

    return (
        <VilkårperiodeKortBase vilkårperiode={målgruppe} redigeres>
            <FeltContainer>
                <EndreTypeOgDatoer
                    form={form}
                    oppdaterTypeIForm={oppdaterType}
                    oppdaterPeriode={oppdaterForm}
                    typeOptions={målgruppeTyperForStønadstype(behandling.stønadstype)}
                    formFeil={vilkårsperiodeFeil}
                    kanEndreType={kanEndreType}
                    erStøttetType={erMålgruppeSomStøttes}
                />
            </FeltContainer>

            <MålgruppeDelvilkår
                målgruppeForm={form}
                oppdaterVurderinger={(key: keyof SvarMålgruppe, nyttSvar: SvarJaNei) =>
                    settForm((prevState) => ({
                        ...prevState,
                        vurderinger: { ...prevState.vurderinger, [key]: nyttSvar },
                    }))
                }
                stønadstype={behandling.stønadstype}
            />
            {erMålgruppeSomStøttes && (
                <Begrunnelse
                    begrunnelse={form?.begrunnelse || ''}
                    oppdaterBegrunnelse={(nyBegrunnelse) =>
                        oppdaterForm('begrunnelse', nyBegrunnelse)
                    }
                    delvilkårSomKreverBegrunnelse={delvilkårSomKreverBegrunnelse}
                    feil={vilkårsperiodeFeil?.begrunnelse}
                />
            )}
            <HStack gap="4">
                {erMålgruppeSomStøttes && (
                    <Button size="xsmall" onClick={lagre}>
                        Lagre
                    </Button>
                )}

                <Button onClick={avbrytRedigering} variant="secondary" size="xsmall">
                    Avbryt
                </Button>
                {målgruppe !== undefined && (
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

export default EndreMålgruppe;
