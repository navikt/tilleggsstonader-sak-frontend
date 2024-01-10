import React from 'react';

import { UNSAFE_Combobox } from '@navikt/ds-react';

import { arkivtemaerListe } from './arkivtema';

const ArkivtemaVelger: React.FC<{
    valgteArkivtemaer?: string[];
    oppdaterValgteArkivtemaer: (option: string, isSelected: boolean) => void;
}> = ({ valgteArkivtemaer, oppdaterValgteArkivtemaer }) => {
    return (
        <UNSAFE_Combobox
            label="Arkivtema"
            options={arkivtemaerListe}
            selectedOptions={valgteArkivtemaer}
            isMultiSelect
            onToggleSelected={oppdaterValgteArkivtemaer}
        />
    );
};

export default ArkivtemaVelger;
