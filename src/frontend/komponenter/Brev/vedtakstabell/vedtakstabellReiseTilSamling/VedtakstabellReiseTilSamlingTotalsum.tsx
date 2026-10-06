import React from 'react';

import {
    borderStyle,
    bredder,
    cellStyle,
    Samlingsgruppe,
    stønadsbeløpCelleStyle,
    stønadsbeløpKolonneBredde,
    summerBeløpForGruppe,
} from './util';
import { kronerMedTusenSkilleEllerStrek } from '../../../../utils/tekstformatering';

export const VedtakstabellReiseTilSamlingTotalsum: React.FC<{
    gruppe: Samlingsgruppe;
}> = ({ gruppe }) => {
    return (
        <table
            style={{
                margin: 0,
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
                border: borderStyle,
            }}
        >
            <colgroup>
                <col style={{ width: bredder.kolonner.privatBil[0] }} />
                <col style={{ width: bredder.kolonner.privatBil[1] }} />
                <col style={{ width: bredder.kolonner.privatBil[2] }} />
                <col style={{ width: bredder.kolonner.privatBil[3] }} />
                <col style={{ width: stønadsbeløpKolonneBredde }} />
            </colgroup>
            <tbody>
                <tr>
                    <td colSpan={4} style={{ ...cellStyle, fontWeight: 600 }}>
                        Totalsum
                    </td>
                    <td style={{ ...stønadsbeløpCelleStyle, fontWeight: 600 }}>
                        {kronerMedTusenSkilleEllerStrek(summerBeløpForGruppe(gruppe))}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
