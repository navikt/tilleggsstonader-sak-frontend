import React from 'react';

import styled from 'styled-components';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { målgruppeErNedsattArbeidsevne, målgrupperHvorMedlemskapMåVurderes } from './utils';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe } from '../typer/målgruppe';
import { SvarJaNei, Vurdering } from '../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

// TODO: Rename til MålgruppeDelvilkår
const MålgruppeVilkår: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ målgruppeForm, oppdaterDelvilkår }) => {
    if (målgruppeForm.type === '') return null;

    const skalVurdereMedlemskap = målgrupperHvorMedlemskapMåVurderes.includes(målgruppeForm.type);
    const skalVurdereDekketAvAnnetRegelverk = målgruppeErNedsattArbeidsevne(målgruppeForm.type);

    if (
        skalVurdereDekketAvAnnetRegelverk &&
        !målgruppeForm.delvilkår.dekketAvAnnetRegelverk?.svar
    ) {
        oppdaterDelvilkår('dekketAvAnnetRegelverk', { svar: SvarJaNei.NEI });
    }

    if (!skalVurdereMedlemskap && !skalVurdereDekketAvAnnetRegelverk) {
        return null;
    }

    return (
        <Container>
            {skalVurdereMedlemskap && (
                <JaNeiVurdering
                    label="Medlemskap i folketrygden?"
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                />
            )}
            {skalVurdereDekketAvAnnetRegelverk && (
                <JaNeiVurdering
                    label="Dekkes utgiftene av annet regelverk?"
                    vurdering={målgruppeForm.delvilkår.dekketAvAnnetRegelverk}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('dekketAvAnnetRegelverk', vurdering)
                    }
                />
            )}
        </Container>
    );
};

export default MålgruppeVilkår;
