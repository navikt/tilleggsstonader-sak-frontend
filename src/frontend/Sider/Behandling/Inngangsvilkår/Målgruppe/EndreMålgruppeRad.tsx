import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';

import EndreMålgruppeInnhold from './EndreMålgruppeInnhold';
import { nyMålgruppe } from './utils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import Select from '../../../../komponenter/Skjema/Select';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode, validerPeriodeForm } from '../../../../utils/periode';
import { DelvilkårMålgruppe, Målgruppe, MålgruppeType } from '../typer/målgruppe';
import { KildeVilkårsperiode, VilkårPeriodeResultat, Vurdering } from '../typer/vilkårperiode';

const TabellRad = styled(Table.Row)`
    .navds-table__data-cell {
        border-color: transparent;
        vertical-align: top;
    }
`;

const KnappeRad = styled.div`
    display: flex;
    gap: 0.5rem;
`;

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

    return (
        <>
            <TabellRad>
                <Table.DataCell width="max-content">
                    <VilkårsresultatIkon
                        vilkårsresultat={målgruppe?.resultat || VilkårPeriodeResultat.IKKE_VURDERT}
                    />
                </Table.DataCell>
                <Table.DataCell>
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
                            <option value={type}>{type}</option>
                        ))}
                    </Select>
                </Table.DataCell>
                <Table.DataCell>
                    <DateInput
                        erLesevisning={målgruppe?.kilde === KildeVilkårsperiode.SYSTEM}
                        label={'Fra'}
                        hideLabel
                        value={målgruppeForm.fom}
                        onChange={(dato) =>
                            settMålgruppeForm((prevState) => ({
                                ...prevState,
                                fom: dato || '',
                            }))
                        }
                        size="small"
                        feil={periodeFeil?.fom}
                    />
                </Table.DataCell>
                <Table.DataCell>
                    <DateInput
                        erLesevisning={målgruppe?.kilde === KildeVilkårsperiode.SYSTEM}
                        label={'Til'}
                        hideLabel
                        value={målgruppeForm.tom}
                        onChange={(dato) =>
                            settMålgruppeForm((prevState) => ({ ...prevState, tom: dato || '' }))
                        }
                        size="small"
                        feil={periodeFeil?.tom}
                    />
                </Table.DataCell>
                <Table.DataCell>{målgruppe?.kilde || KildeVilkårsperiode.MANUELL}</Table.DataCell>
                <Table.DataCell>
                    <KnappeRad>
                        <Button size="small" onClick={lagre}>
                            Legg til ny
                        </Button>

                        <Button onClick={avbrytRedigering} variant="secondary" size="small">
                            Avbryt
                        </Button>
                    </KnappeRad>
                </Table.DataCell>
            </TabellRad>
            <EndreMålgruppeInnhold
                målgruppeForm={målgruppeForm}
                målgruppeType={målgruppeForm.type}
                oppdaterBegrunnelse={(begrunnelse: string) =>
                    settMålgruppeForm((prevState) => ({ ...prevState, begrunnelse: begrunnelse }))
                }
                oppdaterDelvilkår={(key: keyof DelvilkårMålgruppe, vurdering: Vurdering) =>
                    settMålgruppeForm((prevState) => ({
                        ...prevState,
                        delvilkår: { ...prevState.delvilkår, [key]: vurdering },
                    }))
                }
                feilmelding={feilmelding}
            />
        </>
    );
};

export default EndreMålgruppeRad;
