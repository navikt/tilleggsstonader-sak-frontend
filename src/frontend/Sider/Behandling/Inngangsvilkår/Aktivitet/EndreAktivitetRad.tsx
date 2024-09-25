import React, { useState } from 'react';

import AktivitetVilkår from './AktivitetVilkår';
import { nyAktivitet, resettAktivitet } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../hooks/useRevurderingAvPerioder';
import { useTriggRerendringAvDateInput } from '../../../../hooks/useTriggRerendringAvDateInput';
import TextField from '../../../../komponenter/Skjema/TextField';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import {
    Aktivitet,
    AktivitetType,
    aktivitetTypeOptions,
    DelvilkårAktivitet,
} from '../typer/aktivitet';
import {
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

const initaliserForm = (
    behandlingId: string,
    eksisterendeAktivitet?: Aktivitet,
    aktivitetFraRegister?: Registeraktivitet
): EndreAktivitetForm => {
    return eksisterendeAktivitet === undefined
        ? nyAktivitet(behandlingId, aktivitetFraRegister)
        : { ...eksisterendeAktivitet, behandlingId: behandlingId };
};

// TODO: Rename til EndreAktivitet
const EndreAktivitetRad: React.FC<{
    aktivitet?: Aktivitet;
    avbrytRedigering: () => void;
    aktivitetFraRegister?: Registeraktivitet;
}> = ({ aktivitet, avbrytRedigering, aktivitetFraRegister }) => {
    const { request } = useApp();
    const { behandling, behandlingFakta } = useBehandling();
    const { oppdaterAktivitet, leggTilAktivitet, settStønadsperiodeFeil } = useInngangsvilkår();
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    const [aktivitetForm, settAktivitetForm] = useState<EndreAktivitetForm>(
        initaliserForm(behandling.id, aktivitet, aktivitetFraRegister)
    );
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [vilkårsperiodeFeil, settVilkårsperiodeFeil] =
        useState<FormErrors<EndreVilkårsperiode>>();

    const validerForm = (): boolean => {
        const vilkårsperiodeFeil = validerVilkårsperiode(aktivitetForm);
        settVilkårsperiodeFeil(vilkårsperiodeFeil);

        return isValid(vilkårsperiodeFeil);
    };

    const nyRadLeggesTil = aktivitet === undefined;

    const lagre = () => {
        if (laster) return;
        settFeilmelding(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settLaster(true);

            return request<LagreVilkårperiodeResponse<Aktivitet>, EndreAktivitetForm>(
                nyRadLeggesTil
                    ? `/api/sak/vilkarperiode`
                    : `/api/sak/vilkarperiode/${aktivitet.id}`,
                'POST',
                aktivitetForm
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        if (nyRadLeggesTil) {
                            leggTilAktivitet(res.data.periode);
                        } else {
                            oppdaterAktivitet(res.data.periode);
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

    const oppdaterVilkårperiode = (key: keyof Aktivitet, nyVerdi: string) => {
        settAktivitetForm((prevState) => ({ ...prevState, [key]: nyVerdi }));
    };

    const oppdaterType = (type: AktivitetType) => {
        settAktivitetForm((prevState) =>
            resettAktivitet(type, prevState, behandlingFakta.søknadMottattTidspunkt)
        );
        oppdaterFomDatoKey();
        oppdaterTomDatoKey();
    };

    const felterSomKanEndresIPerioden = useRevurderingAvPerioder({
        periodeFom: aktivitetForm.fom,
        periodeTom: aktivitetForm.tom,
        nyRadLeggesTil: nyRadLeggesTil,
    });

    return (
        <EndreVilkårperiodeRad
            type={'Aktivitet'}
            vilkårperiode={aktivitet}
            form={aktivitetForm}
            felterSomKanEndres={felterSomKanEndresIPerioden}
            lagre={lagre}
            avbrytRedigering={avbrytRedigering}
            oppdaterForm={oppdaterVilkårperiode}
            vilkårsperiodeFeil={vilkårsperiodeFeil}
            typeOptions={aktivitetTypeOptions}
            oppdaterType={(nyttValg) => oppdaterType(nyttValg as AktivitetType)}
            feilmelding={feilmelding}
            fomKeyDato={fomKeyDato}
            tomKeyDato={tomKeyDato}
            ekstraCeller={
                aktivitetForm.type !== AktivitetType.INGEN_AKTIVITET && (
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
                        readOnly={felterSomKanEndresIPerioden != 'ALLE'}
                    />
                )
            }
        >
            <AktivitetVilkår
                aktivitetForm={aktivitetForm}
                readOnly={felterSomKanEndresIPerioden != 'ALLE'}
                oppdaterDelvilkår={(key: keyof DelvilkårAktivitet, vurdering: Vurdering) =>
                    settAktivitetForm((prevState) => ({
                        ...prevState,
                        delvilkår: { ...prevState.delvilkår, [key]: vurdering },
                    }))
                }
            />
        </EndreVilkårperiodeRad>
    );
};

export default EndreAktivitetRad;
