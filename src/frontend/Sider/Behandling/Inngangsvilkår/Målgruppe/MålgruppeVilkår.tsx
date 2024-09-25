import React from 'react';

import styled from 'styled-components';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { målgruppeTilMedlemskapHjelpetekst } from './hjelpetekstVurdereMålgruppe';
import { målgrupperHvorMedlemskapMåVurderes, skalVurdereDekkesAvAnnetRegelverk } from './utils';
import { FelterSomKanEndresIPerioden } from '../../../../hooks/useRevurderingAvPerioder';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe } from '../typer/målgruppe';
import { Vurdering } from '../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

// TODO: Rename til MålgruppeDelvilkår
const MålgruppeVilkår: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    felterSomKanEndres: FelterSomKanEndresIPerioden;
}> = ({ målgruppeForm, oppdaterDelvilkår, felterSomKanEndres }) => {
    if (målgruppeForm.type === '') return null;

    const skalVurdereMedlemskap = målgrupperHvorMedlemskapMåVurderes.includes(målgruppeForm.type);
    const skalVurdereDekketAvAnnetRegelverk = skalVurdereDekkesAvAnnetRegelverk(målgruppeForm.type);

    if (!skalVurdereMedlemskap && !skalVurdereDekketAvAnnetRegelverk) {
        return null;
    }

    return (
        <Container>
            {skalVurdereMedlemskap && (
                <JaNeiVurdering
                    label="Medlemskap i folketrygden?"
                    readOnly={felterSomKanEndres != 'ALLE'}
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                    hjelpetekst={målgruppeTilMedlemskapHjelpetekst(målgruppeForm.type)}
                />
            )}
            {skalVurdereDekketAvAnnetRegelverk && (
                <JaNeiVurdering
                    label="Dekkes utgiftene av annet regelverk?"
                    readOnly={felterSomKanEndres != 'ALLE'}
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
