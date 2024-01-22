import React, { useState } from 'react';

import { nyAktivitet } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import Select from '../../../../komponenter/Skjema/Select';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode, validerPeriodeForm } from '../../../../utils/periode';
import { Aktivitet, AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        erNyPeriode ? leggTilAktivitet : oppdaterAktivitet;
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
                periodeForm={aktivitetForm}
                lagre={lagre}
                avbrytRedigering={avbrytRedigering}
                oppdaterPeriode={oppdaterPeriode}
                periodeFeil={periodeFeil}
                typeSelect={
                    <Select
                        label="Type"
                        hideLabel
                        erLesevisning={aktivitet !== undefined}
                        value={aktivitetForm.type}
                        onChange={(e) =>
                            settAktivitetForm((prevState) => ({
                                ...prevState,
                                type: e.target.value as AktivitetType,
                            }))
                        }
                        size="small"
                    >
                        <option value="">Velg</option>
                        {Object.keys(AktivitetType).map((type) => (
                            <option value={type}>{type}</option>
                        ))}
                    </Select>
                }
            />
            {/* TODO: Legg inn vilkår for aktivitet */}
        </>
    );
};

export default EndreAktivitetRad;
