import React, { useState } from 'react';

import MålgruppeVilkår from './MålgruppeVilkår';
import { nyMålgruppe } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import Select from '../../../../komponenter/Skjema/Select';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode, validerPeriodeForm } from '../../../../utils/periode';
import {
    DelvilkårMålgruppe,
    Målgruppe,
    MålgruppeType,
    målgruppeTypeTilTekst,
} from '../typer/målgruppe';
import { Vurdering } from '../typer/vilkårperiode';
import EndreVilkårPeriodeInnhold from '../Vilkårperioder/EndreVilkårperiodeInnhold';
import EndreVilkårperiodeRad from '../Vilkårperioder/EndreVilkårperiodeRad';

export interface EndreMålgruppeForm {
    behandlingId: string;
    type: MålgruppeType | '';
    fom: string;
    tom: string;
    delvilkår: DelvilkårMålgruppe;
    begrunnelse?: string;
}

const initaliserForm = (behandlingId: string, eksisterendeMålgruppe?: Målgruppe) => {
    return eksisterendeMålgruppe === undefined
        ? nyMålgruppe(behandlingId)
        : { ...eksisterendeMålgruppe, behandlingId: behandlingId };
};

const EndreMålgruppeRad: React.FC<{
    målgruppe?: Målgruppe;
    avbrytRedigering: () => void;
}> = ({ målgruppe, avbrytRedigering }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { oppdaterMålgruppe, leggTilMålgruppe } = useInngangsvilkår();

    const [målgruppeForm, settMålgruppeForm] = useState<EndreMålgruppeForm>(
        initaliserForm(behandling.id, målgruppe)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [periodeFeil, settPeriodeFeil] = useState<FormErrors<Periode>>();

    const validerForm = (): boolean => {
        const periodeFeil = validerPeriodeForm(målgruppeForm);
        settPeriodeFeil(periodeFeil);

        return isValid(periodeFeil);
    };

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settLaster(true);

            const erNyPeriode = målgruppe === undefined;

            return request<Målgruppe, EndreMålgruppeForm>(
                erNyPeriode ? `/api/sak/vilkarperiode` : `/api/sak/vilkarperiode/${målgruppe.id}`,
                'POST',
                målgruppeForm
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        erNyPeriode ? leggTilMålgruppe(res.data) : oppdaterMålgruppe(res.data);
                        avbrytRedigering();
                    } else {
                        settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                    }
                })
                .finally(() => settLaster(false));
        }
    };

    const oppdaterPeriode = (key: keyof Periode, nyVerdi: string) => {
        settMålgruppeForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    return (
        <>
            <EndreVilkårperiodeRad
                vilkårperiode={målgruppe}
                periodeForm={målgruppeForm}
                lagre={lagre}
                avbrytRedigering={avbrytRedigering}
                oppdaterPeriode={oppdaterPeriode}
                periodeFeil={periodeFeil}
                typeSelect={
                    <Select
                        label="Type"
                        hideLabel
                        erLesevisning={målgruppe !== undefined}
                        value={målgruppeForm.type}
                        onChange={(e) =>
                            settMålgruppeForm((prevState) => ({
                                ...prevState,
                                type: e.target.value as MålgruppeType,
                            }))
                        }
                        size="small"
                    >
                        <option value="">Velg</option>
                        {Object.keys(MålgruppeType).map((type) => (
                            <option value={type}>
                                {målgruppeTypeTilTekst[type as MålgruppeType]}
                            </option>
                        ))}
                    </Select>
                }
            />
            <EndreVilkårPeriodeInnhold
                oppdaterBegrunnelse={(begrunnelse: string) =>
                    settMålgruppeForm((prevState) => ({ ...prevState, begrunnelse: begrunnelse }))
                }
                feilmelding={feilmelding}
                vilkår={
                    <MålgruppeVilkår
                        målgruppeForm={målgruppeForm}
                        oppdaterDelvilkår={(key: keyof DelvilkårMålgruppe, vurdering: Vurdering) =>
                            settMålgruppeForm((prevState) => ({
                                ...prevState,
                                delvilkår: { ...prevState.delvilkår, [key]: vurdering },
                            }))
                        }
                    />
                }
            />
        </>
    );
};

export default EndreMålgruppeRad;
