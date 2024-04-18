import React, { useState } from 'react';

import MålgruppeVilkår from './MålgruppeVilkår';
import { nyMålgruppe } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import {
    DelvilkårMålgruppe,
    Målgruppe,
    MålgruppeType,
    MålgruppeTypeOptions,
} from '../typer/målgruppe';
import {
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import EndreVilkårperiodeRad from '../Vilkårperioder/EndreVilkårperiodeRad';
import { EndreVilkårsperiode, validerVilkårsperiode } from '../Vilkårperioder/validering';

export interface EndreMålgruppeForm extends Periode {
    behandlingId: string;
    type: MålgruppeType | '';
    delvilkår: DelvilkårMålgruppe;
    begrunnelse?: string;
}

const initaliserForm = (behandlingId: string, eksisterendeMålgruppe?: Målgruppe) => {
    return eksisterendeMålgruppe === undefined
        ? nyMålgruppe(behandlingId)
        : { ...eksisterendeMålgruppe, behandlingId: behandlingId };
};

// TODO: Endre navn til EndreMålgruppe
const EndreMålgruppeRad: React.FC<{
    målgruppe?: Målgruppe;
    avbrytRedigering: () => void;
}> = ({ målgruppe, avbrytRedigering }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { oppdaterMålgruppe, leggTilMålgruppe, settStønadsperiodeFeil } = useInngangsvilkår();

    const [målgruppeForm, settMålgruppeForm] = useState<EndreMålgruppeForm>(
        initaliserForm(behandling.id, målgruppe)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<EndreVilkårsperiode>>();

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerVilkårsperiode(målgruppeForm);
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
                målgruppeForm
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        erNyPeriode
                            ? leggTilMålgruppe(res.data.periode)
                            : oppdaterMålgruppe(res.data.periode);
                        if (res.data.stønadsperiodeStatus === StønadsperiodeStatus.Ok) {
                            settStønadsperiodeFeil(undefined);
                        } else {
                            settStønadsperiodeFeil(res.data.stønadsperiodeFeil);
                        }
                        avbrytRedigering();
                    } else {
                        settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                    }
                })
                .finally(() => settLaster(false));
        }
    };

    const oppdaterForm = (key: keyof Målgruppe, nyVerdi: string) => {
        settMålgruppeForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    return (
        <EndreVilkårperiodeRad
            vilkårperiode={målgruppe}
            form={målgruppeForm}
            lagre={lagre}
            avbrytRedigering={avbrytRedigering}
            oppdaterForm={oppdaterForm}
            vilkårsperiodeFeil={vilkårsperiodeFeil}
            typeOptions={MålgruppeTypeOptions}
            oppdaterType={(nyttValg) =>
                settMålgruppeForm((prevState) => ({
                    ...prevState,
                    type: nyttValg as MålgruppeType,
                }))
            }
            feilmelding={feilmelding}
        >
            {målgruppeForm.type !== '' && (
                <MålgruppeVilkår
                    type={målgruppeForm.type}
                    delvilkår={målgruppeForm.delvilkår}
                    oppdaterDelvilkår={(key: keyof DelvilkårMålgruppe, vurdering: Vurdering) =>
                        settMålgruppeForm((prevState) => ({
                            ...prevState,
                            delvilkår: { ...prevState.delvilkår, [key]: vurdering },
                        }))
                    }
                />
            )}
        </EndreVilkårperiodeRad>
    );
};

export default EndreMålgruppeRad;
