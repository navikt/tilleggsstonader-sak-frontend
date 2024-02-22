import React, { useState } from 'react';

import { Table, TextField } from '@navikt/ds-react';

import AktivitetVilkår from './AktivitetVilkår';
import { nyAktivitet } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import {
    Aktivitet,
    AktivitetType,
    AktivitetTypeOptions,
    DelvilkårAktivitet,
} from '../typer/aktivitet';
import {
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import EndreVilkårPeriodeInnhold from '../Vilkårperioder/EndreVilkårperiodeInnhold';
import EndreVilkårperiodeRad from '../Vilkårperioder/EndreVilkårperiodeRad';
import { EndreVilkårsperiode, validerVilkårsperiode } from '../Vilkårperioder/validering';

export interface EndreAktivitetForm extends Periode {
    aktivitetsdager?: number;
    behandlingId: string;
    type: AktivitetType | '';
    delvilkår: DelvilkårAktivitet;
    begrunnelse?: string;
}

const initaliserForm = (behandlingId: string, eksisterendeAktivitet?: Aktivitet) => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(behandlingId)
        : { ...eksisterendeAktivitet, behandlingId: behandlingId };
};

function validerAktivitetsdager(aktivitetsdager: number | undefined): string | undefined {
    const feilmelding = 'Aktivitetsdager må være et tall mellom 1 og 5';
    if (!harTallverdi(aktivitetsdager)) {
        return feilmelding;
    } else if (aktivitetsdager < 1 || aktivitetsdager > 5) {
        return feilmelding;
    }
}

const EndreAktivitetRad: React.FC<{
    aktivitet?: Aktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, avbrytRedigering }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();

    const [aktivitetForm, settAktivitetForm] = useState<EndreAktivitetForm>(
        initaliserForm(behandling.id, aktivitet)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [aktivitetsdagerFeil, settAktivitetsdagerFeil] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<EndreVilkårsperiode>>();

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerVilkårsperiode(aktivitetForm);
        settVilkårsperiodeFeil(vilkårsperiodeFeil);

        const aktivitetsdagerFeil = validerAktivitetsdager(aktivitetForm.aktivitetsdager);
        settAktivitetsdagerFeil(aktivitetsdagerFeil);

        return isValid(vilkårsperiodeFeil) && aktivitetsdagerFeil === undefined;
    };

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settLaster(true);

            const erNyPeriode = aktivitet === undefined;

            return request<LagreVilkårperiodeResponse<Aktivitet>, EndreAktivitetForm>(
                erNyPeriode ? `/api/sak/vilkarperiode` : `/api/sak/vilkarperiode/${aktivitet.id}`,
                'POST',
                aktivitetForm
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        erNyPeriode
                            ? leggTilAktivitet(res.data.periode)
                            : oppdaterAktivitet(res.data.periode);

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

    const oppdaterPeriode = (key: keyof Periode, nyVerdi: string) => {
        settAktivitetForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    return (
        <>
            <EndreVilkårperiodeRad
                vilkårperiode={aktivitet}
                form={aktivitetForm}
                lagre={lagre}
                avbrytRedigering={avbrytRedigering}
                oppdaterPeriode={oppdaterPeriode}
                vilkårsperiodeFeil={vilkårsperiodeFeil}
                typeOptions={AktivitetTypeOptions}
                oppdaterType={(nyttValg) =>
                    settAktivitetForm((prevState) => ({
                        ...prevState,
                        type: nyttValg as AktivitetType,
                    }))
                }
                ekstraCeller={
                    <Table.DataCell>
                        <TextField
                            label="Aktivitetsdager"
                            hideLabel
                            value={
                                harTallverdi(aktivitetForm.aktivitetsdager)
                                    ? aktivitetForm.aktivitetsdager
                                    : ''
                            }
                            onChange={(event) =>
                                settAktivitetForm((prevState) => ({
                                    ...prevState,
                                    aktivitetsdager: tilHeltall(event.target.value),
                                }))
                            }
                            size="small"
                            error={aktivitetsdagerFeil}
                        />
                    </Table.DataCell>
                }
            />
            <EndreVilkårPeriodeInnhold
                begrunnelse={aktivitetForm.begrunnelse}
                oppdaterBegrunnelse={(begrunnelse: string) =>
                    settAktivitetForm((prevState) => ({ ...prevState, begrunnelse: begrunnelse }))
                }
                feilmelding={feilmelding}
                vilkår={
                    <AktivitetVilkår
                        aktivitetForm={aktivitetForm}
                        oppdaterDelvilkår={(key: keyof DelvilkårAktivitet, vurdering: Vurdering) =>
                            settAktivitetForm((prevState) => ({
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

export default EndreAktivitetRad;
