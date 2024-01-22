import React from 'react';

import styled from 'styled-components';

import { Table, Textarea } from '@navikt/ds-react';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import Medlemskap from './Medlemskap';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { DelvilkårMålgruppe, MålgruppeType } from '../typer/målgruppe';
import { Vurdering } from '../typer/vilkårperiode';

const Innhold = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
    max-width: 40rem;
`;

const EndreMålgruppeInnhold: React.FC<{
    målgruppeType: MålgruppeType | '';
    målgruppeForm: EndreMålgruppeForm;
    oppdaterBegrunnelse: (begrunnelse: string) => void;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ målgruppeType, målgruppeForm, oppdaterBegrunnelse, oppdaterDelvilkår, feilmelding }) => {
    const utledRelevanteVilkår = () => {
        switch (målgruppeType) {
            case '':
            case MålgruppeType.AAP:
            case MålgruppeType.OVERGANGSSTØNAD:
            case MålgruppeType.UFØRETRYGD:
                return null;

            case MålgruppeType.OMSTILLINGSSTØNAD:
                return (
                    <Medlemskap
                        medlemskap={målgruppeForm.delvilkår.medlemskap}
                        oppdaterMedlemskap={(vurdering: Vurdering) =>
                            oppdaterDelvilkår('medlemskap', vurdering)
                        }
                        målgruppeType={målgruppeType}
                    />
                );

            case MålgruppeType.NEDSATT_ARBEIDSEVNE:
                return (
                    //TODO: Vurdering av nedsatt arbeidsevne
                    <Medlemskap
                        medlemskap={målgruppeForm.delvilkår.medlemskap}
                        oppdaterMedlemskap={(vurdering: Vurdering) =>
                            oppdaterDelvilkår('medlemskap', vurdering)
                        }
                        målgruppeType={målgruppeType}
                    />
                );
            default:
                return <Feilmelding>Mangler mapping av {målgruppeType}</Feilmelding>;
        }
    };

    return (
        <Table.Row shadeOnHover={false}>
            <Table.DataCell />
            <Table.DataCell colSpan={999}>
                <Innhold>
                    {utledRelevanteVilkår()}
                    <Textarea
                        label={'Kommentar til periode'}
                        value={målgruppeForm.begrunnelse || ''}
                        onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                        size="small"
                    />
                    <Feilmelding>{feilmelding}</Feilmelding>
                </Innhold>
            </Table.DataCell>
        </Table.Row>
    );
};

export default EndreMålgruppeInnhold;
