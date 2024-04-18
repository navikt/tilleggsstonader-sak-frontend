import React from 'react';

import styled from 'styled-components';

import { målgruppeErNedsattArbeidsevne, målgrupperHvorMedlemskapMåVurderes } from './utils';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe, MålgruppeType } from '../typer/målgruppe';
import { SvarJaNei, Vurdering } from '../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

// TODO: Rename til MålgruppeDelvilkår
const MålgruppeVilkår: React.FC<{
    type: MålgruppeType;
    delvilkår: DelvilkårMålgruppe;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ type, delvilkår, oppdaterDelvilkår }) => {
    const skalVurdereMedlemskap = målgrupperHvorMedlemskapMåVurderes.includes(type);
    const skalVurdereDekketAvAnnetRegelverk = målgruppeErNedsattArbeidsevne(type);

    if (skalVurdereDekketAvAnnetRegelverk && !delvilkår.dekketAvAnnetRegelverk?.svar) {
        oppdaterDelvilkår('dekketAvAnnetRegelverk', { svar: SvarJaNei.NEI });
    }

    if (skalVurdereMedlemskap || skalVurdereDekketAvAnnetRegelverk) {
        return (
            <Container>
                {skalVurdereMedlemskap && (
                    <JaNeiVurdering
                        label="Medlemskap i folketrygden?"
                        vurdering={delvilkår.medlemskap}
                        oppdaterVurdering={(vurdering: Vurdering) =>
                            oppdaterDelvilkår('medlemskap', vurdering)
                        }
                    />
                )}
                {skalVurdereDekketAvAnnetRegelverk && (
                    <JaNeiVurdering
                        label="Dekkes utgiftene av annet regelverk?"
                        vurdering={delvilkår.dekketAvAnnetRegelverk}
                        oppdaterVurdering={(vurdering: Vurdering) =>
                            oppdaterDelvilkår('dekketAvAnnetRegelverk', vurdering)
                        }
                    />
                )}
            </Container>
        );
    }

    return null;
};

export default MålgruppeVilkår;
