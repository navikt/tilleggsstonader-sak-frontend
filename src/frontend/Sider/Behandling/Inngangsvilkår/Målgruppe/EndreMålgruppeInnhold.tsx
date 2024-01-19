import React from 'react';

import styled from 'styled-components';

import { Radio, RadioGroup, Table, Textarea } from '@navikt/ds-react';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { DelvilkårMålgruppe, MålgruppeType } from '../typer/målgruppe';
import { SvarJaNei, Vurdering } from '../typer/vilkårperiode';

const Innhold = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
    max-width: 40rem;
`;

const EndreMålgruppeInnhold: React.FC<{
    målgruppeType: MålgruppeType;
    målgruppeForm: EndreMålgruppeForm;
    oppdaterBegrunnelse: (begrunnelse: string) => void;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ målgruppeType, målgruppeForm, oppdaterBegrunnelse, oppdaterDelvilkår, feilmelding }) => {
    const oppdaterDelvilkårSvar = (svar: SvarJaNei) => {
        oppdaterDelvilkår('medlemskap', {
            ...målgruppeForm.delvilkår.medlemskap,
            svar: svar,
        });
    };

    const oppdaterDelvilkårBegrunnelse = (begrunnelse: string) => {
        oppdaterDelvilkår('medlemskap', {
            ...målgruppeForm.delvilkår.medlemskap,
            begrunnelse: begrunnelse,
        });
    };

    const utledRelevanteVilkår = () => {
        switch (målgruppeType) {
            case MålgruppeType.AAP:
            case MålgruppeType.OVERGANGSSTØNAD:
            case MålgruppeType.UFØRETRYGD:
                return null;

            case MålgruppeType.OMSTILLINGSSTØNAD:
                return (
                    <>
                        <RadioGroup
                            value={målgruppeForm.delvilkår.medlemskap}
                            legend="Medlem"
                            onChange={(e) => oppdaterDelvilkårSvar(e.target.value)}
                        >
                            <Radio value={SvarJaNei.JA}>Vurdert etter første ledd (medlem)</Radio>
                            <Radio value={SvarJaNei.NEI}>
                                Vurdert etter andre ledd (ikke medlem)
                            </Radio>
                        </RadioGroup>
                        <Textarea
                            value={målgruppeForm.delvilkår.medlemskap?.begrunnelse}
                            onChange={(e) => oppdaterDelvilkårBegrunnelse(e.target.value)}
                            label="Begrunnelse"
                            size="small"
                        />
                    </>
                );

            case MålgruppeType.NEDSATT_ARBEIDSEVNE:
                return (
                    <>
                        <RadioGroup
                            value={målgruppeForm.delvilkår.medlemskap}
                            legend="Medlem"
                            onChange={(e) => oppdaterDelvilkårSvar(e)}
                            size="small"
                        >
                            <Radio value={SvarJaNei.JA}>Ja</Radio>
                            <Radio value={SvarJaNei.NEI}>Nei</Radio>
                        </RadioGroup>
                        <Textarea
                            value={målgruppeForm.delvilkår.medlemskap?.begrunnelse}
                            onChange={(e) => oppdaterDelvilkårBegrunnelse(e.target.value)}
                            label="Begrunnelse"
                            size="small"
                        />
                    </>
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
