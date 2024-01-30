import React, { useState } from 'react';

import AktivitetVilkår from './AktivitetVilkår';
import { nyAktivitet } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode, validerPeriodeForm } from '../../../../utils/periode';
import {
    Aktivitet,
    AktivitetType,
    AktivitetTypeOptions,
    DelvilkårAktivitet,
} from '../typer/aktivitet';
import { Vurdering } from '../typer/vilkårperiode';
import EndreVilkårPeriodeInnhold from '../Vilkårperioder/EndreVilkårperiodeInnhold';
import EndreVilkårperiodeRad from '../Vilkårperioder/EndreVilkårperiodeRad';

export interface EndreAktivitetForm extends Periode {
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

const EndreAktivitetRad: React.FC<{
    aktivitet?: Aktivitet;
    avbrytRedigering: () => void;
}> = ({ aktivitet, avbrytRedigering }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet } = useInngangsvilkår();

    const [aktivitetForm, settAktivitetForm] = useState<EndreAktivitetForm>(
        initaliserForm(behandling.id, aktivitet)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [periodeFeil, settPeriodeFeil] = useState<FormErrors<Periode>>();

    const validerForm = (): boolean => {
        const periodeFeil = validerPeriodeForm(aktivitetForm);
        settPeriodeFeil(periodeFeil);

        return isValid(periodeFeil);
    };

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settLaster(true);

            const erNyPeriode = aktivitet === undefined;

            return request<Aktivitet, EndreAktivitetForm>(
                erNyPeriode
                    ? `/api/sak/vilkarperiode/behandling/${behandling.id}`
                    : `/api/sak/vilkarperiode/${aktivitet.id}`,
                'POST',
                aktivitetForm
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        erNyPeriode ? leggTilAktivitet(res.data) : oppdaterAktivitet(res.data);
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
                periodeFeil={periodeFeil}
                typeOptions={AktivitetTypeOptions}
                oppdaterType={(nyttValg) =>
                    settAktivitetForm((prevState) => ({
                        ...prevState,
                        type: nyttValg as AktivitetType,
                    }))
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
