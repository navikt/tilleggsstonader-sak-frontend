import React from 'react';

import styled from 'styled-components';

import { MålgruppeType } from '../../typer/vilkårperiode/målgruppe';
import { SvarMålgruppeLæremidler } from '../../typer/vilkårperiode/målgruppeLæremidler';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreMålgruppeGenerellForm } from '../EndreMålgruppeGenerell';
import { målgrupperHvorMedlemskapMåVurderes, skalVurdereDekkesAvAnnetRegelverk } from '../utils';
import {
    MedlemskapVurdering,
    DekketAvAnnetRegelverkVurdering,
    GjenlevendeEtterGammeltRegelverkWarning,
} from './DelvilkårMålgruppe';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const MålgruppeLæremidlerVilkår: React.FC<{
    målgruppeForm: EndreMålgruppeGenerellForm;
    oppdaterVurderinger: (key: keyof SvarMålgruppeLæremidler, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ målgruppeForm, oppdaterVurderinger, readOnly }) => {
    if (målgruppeForm.type === '') return null;

    const skalVurdereMedlemskap = målgrupperHvorMedlemskapMåVurderes.includes(målgruppeForm.type);
    const skalVurdereDekketAvAnnetRegelverk = skalVurdereDekkesAvAnnetRegelverk(målgruppeForm.type);
    const erGjenlevendeGammeltRegelverk =
        målgruppeForm.type === MålgruppeType.GJENLEVENDE_GAMMELT_REGELVERK;

    if (
        !skalVurdereMedlemskap &&
        !skalVurdereDekketAvAnnetRegelverk &&
        !erGjenlevendeGammeltRegelverk
    ) {
        return null;
    }

    return (
        <Container>
            {skalVurdereMedlemskap && (
                <MedlemskapVurdering
                    svar={målgruppeForm.vurderinger.svarMedlemskap}
                    readonly={readOnly}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarMedlemskap', nyttSvar)
                    }
                    målgruppetype={målgruppeForm.type}
                />
            )}
            {skalVurdereDekketAvAnnetRegelverk && (
                <DekketAvAnnetRegelverkVurdering
                    readonly={readOnly}
                    svar={målgruppeForm.vurderinger.svarUtgifterDekketAvAnnetRegelverk}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarUtgifterDekketAvAnnetRegelverk', nyttSvar)
                    }
                />
            )}
            {erGjenlevendeGammeltRegelverk && <GjenlevendeEtterGammeltRegelverkWarning />}
        </Container>
    );
};
