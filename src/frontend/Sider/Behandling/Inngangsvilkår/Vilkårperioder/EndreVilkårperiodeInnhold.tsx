import React from 'react';

import styled from 'styled-components';

import { Table, Textarea } from '@navikt/ds-react';

import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';

const Innhold = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
    max-width: 40rem;
`;

const EndreVilkårPeriodeInnhold: React.FC<{
    vilkår: React.ReactNode;
    begrunnelse: string | undefined;
    oppdaterBegrunnelse: (begrunnelse: string) => void;
    feilmelding?: string;
}> = ({ vilkår, begrunnelse, oppdaterBegrunnelse, feilmelding }) => {
    return (
        <Table.Row shadeOnHover={false}>
            <Table.DataCell />
            <Table.DataCell colSpan={999}>
                <Innhold>
                    {vilkår}
                    <Textarea
                        label={'Kommentar til periode'}
                        value={begrunnelse}
                        onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                        size="small"
                    />
                    <Feilmelding>{feilmelding}</Feilmelding>
                </Innhold>
            </Table.DataCell>
        </Table.Row>
    );
};

export default EndreVilkårPeriodeInnhold;
