import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';
import { DelvilkårMålgruppe, Målgruppe } from '../typer/målgruppe';

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

interface EndreMålgruppeForm {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [feilmelding, settFeilmelding] = useState<string>(); // TODO: Vis feilmelding et sted

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
        <Table.Row key={målgruppe.id}>
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon vilkårsresultat={målgruppe.resultat} />
            </Table.DataCell>
            <Table.DataCell>{målgruppe.type}</Table.DataCell>
            <Table.DataCell>
                <DateInput
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
        </Table.Row>
    );
};

export default EndreMålgruppeRad;
