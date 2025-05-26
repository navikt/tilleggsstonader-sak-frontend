import React from 'react';

import { HelpText, HStack } from '@navikt/ds-react';

import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { fjernSpaces } from '../../../../utils/utils';
import { StønadsvilkårType } from '../../vilkår';
import { vilkårTypeTilUtgiftHjelpeTekst, vilkårTypeTilUtgiftTekst } from '../tekster';

const EndreUtgift: React.FC<{
    vilkårtype: StønadsvilkårType;
    erFremtidigUtgift?: boolean;
    utgift?: number;
    alleFelterKanRedigeres: boolean;
    oppdaterUtgift: (verdi: number | undefined) => void;
}> = ({ vilkårtype, erFremtidigUtgift, utgift, alleFelterKanRedigeres, oppdaterUtgift }) => {
    const hjelpetekst = vilkårTypeTilUtgiftHjelpeTekst[vilkårtype];
    return (
        <FeilmeldingMaksBredde $maxWidth={180}>
            <TextField
                label={
                    <HStack gap="2" align="center">
                        {vilkårTypeTilUtgiftTekst[vilkårtype]}
                        {erFremtidigUtgift ? ' (valgfri)' : ''}
                        {hjelpetekst && <HelpText>{hjelpetekst}</HelpText>}
                    </HStack>
                }
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
