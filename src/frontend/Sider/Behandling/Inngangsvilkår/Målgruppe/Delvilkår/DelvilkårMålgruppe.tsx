import React from 'react';

import { Alert, BodyLong, Heading } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { MålgruppeType } from '../../typer/vilkårperiode/målgruppe';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { målgruppeTilMedlemskapHjelpetekst } from '../hjelpetekstVurdereMålgruppe';

export const MedlemskapVurdering: React.FC<{
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
    svar?: SvarJaNei;
    readonly: boolean;
    målgruppetype: MålgruppeType;
}> = ({ oppdaterSvar, svar, readonly, målgruppetype: type }) => {
    return (
        <JaNeiVurdering
            label="Medlemskap i folketrygden?"
            readOnly={readonly}
            svar={svar}
            oppdaterSvar={(nyttSvar: SvarJaNei) => oppdaterSvar(nyttSvar)}
            hjelpetekst={målgruppeTilMedlemskapHjelpetekst(type)}
        />
    );
};

export const DekketAvAnnetRegelverkVurdering: React.FC<{
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
    svar?: SvarJaNei;
    readonly: boolean;
}> = ({ oppdaterSvar, svar, readonly }) => {
    return (
        <JaNeiVurdering
            label="Dekkes utgiftene av annet regelverk?"
            readOnly={readonly}
            svar={svar}
            oppdaterSvar={(nyttSvar: SvarJaNei) => oppdaterSvar(nyttSvar)}
        />
    );
};

export const GjenlevendeEtterGammeltRegelverkWarning: React.FC = () => {
    return (
        <Alert variant="warning" size="small">
            <Heading spacing size="xsmall" level="3">
                Gjenlevende etter gammelt regelverk kan ikke behandles
            </Heading>
            <BodyLong size="small" spacing>
                Det er per d.d. ikke mulig å behandle saker hvor bruker hvor bruker er gjenlevende
                med rett til ytelser etter reglene som gjaldt før 1. januar 2024.
            </BodyLong>
            <BodyLong size="small">
                Sett saken på vent og gi beskjed til TS-teamet på teams med saksnummeret det
                gjelder.
            </BodyLong>
        </Alert>
    );
};
