import React from 'react';

import styled from 'styled-components';

import { Alert, BodyLong, Heading } from '@navikt/ds-react';

import { EndreMålgruppeForm } from './EndreMålgruppe';
import { målgruppeTilMedlemskapHjelpetekst } from './hjelpetekstVurdereMålgruppe';
import {
    målgrupperHvorMedlemskapMåVurderes,
    skalVurdereDekkesAvAnnetRegelverk,
    skalVurdereMottarSykepengerForFulltidsstilling,
} from './utils';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { JaNeiVurdering } from '../../Vilkårvurdering/JaNeiVurdering';
import { MålgruppeType, SvarMålgruppe } from '../typer/vilkårperiode/målgruppe';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const MålgruppeDelvilkår: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterVurderinger: (key: keyof SvarMålgruppe, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
    stønadstype: Stønadstype;
}> = ({ målgruppeForm, oppdaterVurderinger, readOnly, stønadstype }) => {
    if (målgruppeForm.type === '') return null;

    const skalVurdereMedlemskap = målgrupperHvorMedlemskapMåVurderes.includes(målgruppeForm.type);
    const skalVurdereDekketAvAnnetRegelverk = skalVurdereDekkesAvAnnetRegelverk(målgruppeForm.type);
    const skalVurdereSykepengerForFulltidsstilling = skalVurdereMottarSykepengerForFulltidsstilling(
        målgruppeForm.type,
        stønadstype
    );

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
            {skalVurdereSykepengerForFulltidsstilling && (
                <JaNeiVurdering
                    label="Mottar søker sykepenger for fulltidsstilling?"
                    readOnly={readOnly}
                    svar={målgruppeForm.vurderinger.svarMottarSykepengerForFulltidsstilling}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarMottarSykepengerForFulltidsstilling', nyttSvar)
                    }
                    hjelpetekst="Med fulltidsstilling menes at søker jobber 37,5 timer eller mer i uken."
                />
            )}
            {erGjenlevendeGammeltRegelverk && (
                <Alert variant="warning" size="small">
                    <Heading spacing size="xsmall" level="3">
                        Gjenlevende etter gammelt regelverk kan ikke behandles
                    </Heading>
                    <BodyLong size="small" spacing>
                        Det er per d.d. ikke mulig å behandle saker hvor bruker hvor bruker er
                        gjenlevende med rett til ytelser etter reglene som gjaldt før 1. januar
                        2024.
                    </BodyLong>
                    <BodyLong size="small">
                        Sett saken på vent og gi beskjed til TS-teamet på teams med saksnummeret det
                        gjelder.
                    </BodyLong>
                </Alert>
            )}
        </Container>
    );
};

export default MålgruppeDelvilkår;
