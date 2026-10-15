import React from 'react';

import { Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import { erSvarJaNei, NødvendigUtgift } from '../typer/faktaReiseTilSamling';

interface Props {
    nødvendigUtgift: NødvendigUtgift | undefined;
    feilNødvendigUtgift: string | undefined;
    feilBegrunnelse: string | undefined;
    oppdaterFakta: (nødvendigUtgift: NødvendigUtgift) => void;
}

export const NødvendigUtgiftFelt: React.FC<Props> = ({
    nødvendigUtgift,
    feilNødvendigUtgift,
    feilBegrunnelse,
    oppdaterFakta,
}) => {
    const oppdaterErNødvendig = (svar: string) => {
        if (!erSvarJaNei(svar)) {
            return;
        }
        oppdaterFakta({
            erUtgiftenNødvendig: svar,
            begrunnelse: undefined,
        });
    };

    const oppdaterBegrunnelse = (begrunnelse: string) => {
        if (!nødvendigUtgift) {
            return;
        }
        oppdaterFakta({
            erUtgiftenNødvendig: nødvendigUtgift.erUtgiftenNødvendig,
            begrunnelse,
        });
    };

    return (
        <VStack gap="space-16">
            <RadioGroup
                legend="Er hele utgiften nødvendig?"
                description="Vurder om den oppgitte utgiften er på et rimelig nivå for å få gjennomført reisen."
                value={nødvendigUtgift?.erUtgiftenNødvendig || ''}
                size="small"
                error={feilNødvendigUtgift}
                onChange={oppdaterErNødvendig}
            >
                <Radio value="JA">Ja</Radio>
                <Radio value="NEI">Nei</Radio>
            </RadioGroup>

            {nødvendigUtgift?.erUtgiftenNødvendig === 'NEI' && (
                <Textarea
                    label="Hvorfor vurderes ikke hele eller deler av utgiften som nødvendig?"
                    size="small"
                    error={feilBegrunnelse}
                    description="Begrunn vurderingen, og hvilket beløp som kan dekkes. Fyll inn beløpet som dekkes i feltene over, og begrunn dette overfor brukeren i fritekst i brevet."
                    value={nødvendigUtgift.begrunnelse || ''}
                    onChange={(e) => oppdaterBegrunnelse(e.target.value)}
                />
            )}
        </VStack>
    );
};
