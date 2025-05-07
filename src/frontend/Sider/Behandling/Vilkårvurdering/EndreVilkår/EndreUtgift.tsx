import React from 'react';

import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { fjernSpaces } from '../../../../utils/utils';
import { StønadsvilkårType } from '../../vilkår';
import { vilkårTypeTilUtgiftTekst } from '../tekster';

const EndreUtgift: React.FC<{
    vilkårtype: StønadsvilkårType;
    erFremtidigUtgift?: boolean;
    utgift?: number;
    alleFelterKanRedigeres: boolean;
    oppdaterUtgift: (verdi: number | undefined) => void;
}> = ({ vilkårtype, erFremtidigUtgift, utgift, alleFelterKanRedigeres, oppdaterUtgift }) => {
    return (
        <FeilmeldingMaksBredde $maxWidth={180}>
            <TextField
                label={`${vilkårTypeTilUtgiftTekst[vilkårtype]}${erFremtidigUtgift ? ' (valgfri)' : ''}`}
                size="small"
                erLesevisning={false}
                value={harTallverdi(utgift) ? utgift : ''}
                readOnly={!alleFelterKanRedigeres}
                onChange={(e) => {
                    oppdaterUtgift(tilHeltall(fjernSpaces(e.target.value)));
                }}
            />
        </FeilmeldingMaksBredde>
    );
};

export default EndreUtgift;
