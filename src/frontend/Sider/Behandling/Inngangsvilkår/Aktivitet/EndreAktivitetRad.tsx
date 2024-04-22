import React, { useState } from 'react';

import AktivitetVilkår from './AktivitetVilkår';
import { finnBegrunnelseGrunnerAktivitet, nyAktivitet, resetDelvilkår } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import TextField from '../../../../komponenter/Skjema/TextField';
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
    BegrunnelseGrunner,
    KildeVilkårsperiode,
    LagreVilkårperiodeResponse,
    StønadsperiodeStatus,
    Vurdering,
} from '../typer/vilkårperiode';
import EndreVilkårperiodeRad from '../Vilkårperioder/EndreVilkårperiode/EndreVilkårperiodeRad';
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

// TODO: Rename til EndreAktivitet
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
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<EndreVilkårsperiode>>();
    const [delvilkårSomKreverBegrunnelse, settDelvilkårSomKreverBegrunnelse] = useState<
        BegrunnelseGrunner[]
    >([]);

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerVilkårsperiode(aktivitetForm);
        settVilkårsperiodeFeil(vilkårsperiodeFeil);

        return isValid(vilkårsperiodeFeil);
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
                        settFeilmelding(`Feilet legg til periode: ${res.frontendFeilmelding}`);
                    }
                })
                .finally(() => settLaster(false));
        }
    };

    const oppdaterVilkårperiode = (key: keyof Aktivitet, nyVerdi: string) => {
        settAktivitetForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settAktivitetForm((prevState) => ({
            ...prevState,
            type: type,
            delvilkår: resetDelvilkår(type, prevState.delvilkår),
        }));
    };

    const oppdaterDelvilkår = (key: keyof DelvilkårAktivitet, vurdering: Vurdering) => {
        settAktivitetForm((prevState) => {
            const nyeDelvilkår = { ...prevState.delvilkår, [key]: vurdering };

            if (prevState.type !== '') {
                settDelvilkårSomKreverBegrunnelse(finnBegrunnelseGrunnerAktivitet(nyeDelvilkår));
            }
            return {
                ...prevState,
                delvilkår: nyeDelvilkår,
            };
        });
    };

    return (
        <EndreVilkårperiodeRad
            vilkårperiode={aktivitet}
            form={aktivitetForm}
            lagre={lagre}
            avbrytRedigering={avbrytRedigering}
            oppdaterForm={oppdaterVilkårperiode}
            vilkårsperiodeFeil={vilkårsperiodeFeil}
            typeOptions={AktivitetTypeOptions}
            oppdaterType={(nyttValg) => oppdaterType(nyttValg as AktivitetType)}
            feilmelding={feilmelding}
            delvilkårSomKreverBegrunnelse={delvilkårSomKreverBegrunnelse}
            ekstraCeller={
                <TextField
                    erLesevisning={aktivitet?.kilde === KildeVilkårsperiode.SYSTEM}
                    label="Aktivitetsdager"
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
                    error={vilkårsperiodeFeil?.aktivitetsdager}
                    autoComplete="off"
                />
            }
        >
            <AktivitetVilkår
                aktivitetForm={aktivitetForm}
                oppdaterDelvilkår={(key: keyof DelvilkårAktivitet, vurdering: Vurdering) =>
                    oppdaterDelvilkår(key, vurdering)
                }
            />
        </EndreVilkårperiodeRad>
    );
};

export default EndreAktivitetRad;
