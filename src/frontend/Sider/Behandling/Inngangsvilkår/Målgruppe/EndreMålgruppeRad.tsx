import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';

import EndreMålgruppeInnhold from './EndreMålgruppeInnhold';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';
import { DelvilkårMålgruppe, Målgruppe } from '../typer/målgruppe';
import { KildeVilkårsperiode, Vurdering } from '../typer/vilkårperiode';

const TabellRad = styled(Table.Row)`
    .navds-table__data-cell {
        border-color: transparent;
    }
`;

const KnappeRad = styled.div`
    display: flex;
    gap: 0.5rem;
`;

interface EndreMålgruppe {
    behandlingId: string;
    fom?: string;
    tom?: string;
    delvilkår: DelvilkårMålgruppe;
    begrunnelse?: string;
}

export interface EndreMålgruppeForm {
    fom?: string;
    tom?: string;
    delvilkår: DelvilkårMålgruppe;
    begrunnelse?: string;
}

const EndreMålgruppeRad: React.FC<{
    målgruppe: Målgruppe;
    avbrytRedigering: () => void;
}> = ({ målgruppe, avbrytRedigering }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { oppdaterMålgruppe } = useInngangsvilkår();

    const [målgruppeForm, settMålgruppeForm] = useState<EndreMålgruppeForm>(målgruppe);
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const leggTilNyMålgruppe = (form: EndreMålgruppeForm) => {
        if (laster) return;
        settLaster(true);
        settFeilmelding(undefined);
        return request<Målgruppe, EndreMålgruppe>(
            `/api/sak/vilkarperiode/${målgruppe.id}`,
            'POST',
            {
                ...form,
                behandlingId: behandling.id,
            }
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    oppdaterMålgruppe(res.data);
                    avbrytRedigering();
                } else {
                    settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <>
            <TabellRad key={målgruppe.id}>
                <Table.DataCell width="max-content">
                    <VilkårsresultatIkon vilkårsresultat={målgruppe.resultat} />
                </Table.DataCell>
                <Table.DataCell>{målgruppe.type}</Table.DataCell>
                <Table.DataCell>
                    <DateInput
                        erLesevisning={målgruppe.kilde === KildeVilkårsperiode.SYSTEM}
                        label={'Fra'}
                        hideLabel
                        value={målgruppeForm.fom}
                        onChange={(dato) =>
                            settMålgruppeForm((prevState) => ({ ...prevState, fom: dato }))
                        }
                        size="small"
                    />
                </Table.DataCell>
                <Table.DataCell>
                    <DateInput
                        erLesevisning={målgruppe.kilde === KildeVilkårsperiode.SYSTEM}
                        label={'Til'}
                        hideLabel
                        value={målgruppeForm.tom}
                        onChange={(dato) =>
                            settMålgruppeForm((prevState) => ({ ...prevState, tom: dato }))
                        }
                        size="small"
                    />
                </Table.DataCell>
                <Table.DataCell>{målgruppe.kilde}</Table.DataCell>
                <Table.DataCell>
                    <KnappeRad>
                        <Button size="small" onClick={() => leggTilNyMålgruppe(målgruppeForm)}>
                            Lagre
                        </Button>
                        <Button onClick={avbrytRedigering} variant="secondary" size="small">
                            Avbryt
                        </Button>
                    </KnappeRad>
                </Table.DataCell>
            </TabellRad>
            <EndreMålgruppeInnhold
                målgruppeForm={målgruppeForm}
                målgruppeType={målgruppe.type}
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
