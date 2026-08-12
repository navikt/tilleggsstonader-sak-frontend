import React, { FC, useState } from 'react';

import { Button, HStack, UNSAFE_Combobox, VStack } from '@navikt/ds-react';

import { formaterIsoPeriode } from '../../../../../utils/dato';
import { ManuellRegistreringUkeDto } from '../typer';

type TilgjengeligeUker = { value: string; label: string };

export const LeggTilUkerPanel: FC<{
    tilgjengeligeUker: ManuellRegistreringUkeDto[];
    leggTilUker: (uker: ManuellRegistreringUkeDto[]) => void;
    lukkPanel: () => void;
}> = ({ tilgjengeligeUker, leggTilUker, lukkPanel }) => {
    const [valg, settValg] = useState<string[]>([]);

    const uker: TilgjengeligeUker[] = tilgjengeligeUker.map((uke) => ({
        value: uke.fom,
        label: `Uke ${uke.ukenummer} (${formaterIsoPeriode(uke.fom, uke.tom)})`,
    }));

    const valgteUker = uker.filter((uke) => valg.includes(uke.value));

    const onToggleSelected = (option: string, isSelected: boolean) => {
        settValg((prev) =>
            isSelected ? [...prev, option] : prev.filter((value) => value !== option)
        );
    };

    const leggTilValgteUker = () => {
        leggTilUker(tilgjengeligeUker.filter((uke) => valg.includes(uke.fom)));
        lukkPanel();
    };

    return (
        <VStack gap="space-8" width={'700px'}>
            <UNSAFE_Combobox
                label="Velg uker å legge til"
                size="small"
                options={uker}
                selectedOptions={valgteUker}
                onToggleSelected={onToggleSelected}
                isMultiSelect
            />
            <HStack gap="space-8">
                <Button size="small" onClick={leggTilValgteUker} disabled={valg.length === 0}>
                    Legg til
                </Button>
                <Button size="small" variant="tertiary" onClick={lukkPanel}>
                    Avbryt
                </Button>
            </HStack>
        </VStack>
    );
};
