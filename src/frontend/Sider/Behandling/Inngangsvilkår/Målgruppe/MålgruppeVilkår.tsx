import React from 'react';

import styled from 'styled-components';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { målgruppeTilMedlemskapHjelpetekst } from './hjelpetekstVurdereMålgruppe';
import { målgrupperHvorMedlemskapMåVurderes, skalVurdereDekkesAvAnnetRegelverk } from './utils';
import { JaNeiVurdering } from '../../Vilkårvurdering/JaNeiVurdering';
import { SvarMålgruppe } from '../typer/målgruppe';
import { SvarJaNei } from '../typer/vilkårperiode';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

// TODO: Rename til MålgruppeDelvilkår
const MålgruppeVilkår: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterVurderinger: (key: keyof SvarMålgruppe, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ målgruppeForm, oppdaterVurderinger, readOnly }) => {
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
                    readOnly={readOnly}
                    svar={målgruppeForm.vurderinger.svarMedlemskap}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarMedlemskap', nyttSvar)
                    }
                    hjelpetekst={målgruppeTilMedlemskapHjelpetekst(målgruppeForm.type)}
                />
            )}
            {skalVurdereDekketAvAnnetRegelverk && (
                <JaNeiVurdering
                    label="Dekkes utgiftene av annet regelverk?"
                    readOnly={readOnly}
                    svar={målgruppeForm.vurderinger.svarUtgifterDekketAvAnnetRegelverk}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarUtgifterDekketAvAnnetRegelverk', nyttSvar)
                    }
                />
            )}
        </Container>
    );
};

export default MålgruppeVilkår;
