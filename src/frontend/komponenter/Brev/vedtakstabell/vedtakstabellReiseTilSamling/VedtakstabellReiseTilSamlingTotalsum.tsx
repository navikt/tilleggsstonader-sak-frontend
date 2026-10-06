import React from 'react';

import { bredder, cellStyle, Samlingsgruppe, summerBeløpForGruppe } from './util';
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
            }}
        >
            <colgroup>
                <col style={{ width: bredder.kolonner.privatBil[0] }} />
                <col style={{ width: bredder.kolonner.privatBil[1] }} />
                <col style={{ width: bredder.kolonner.privatBil[2] }} />
                <col style={{ width: bredder.kolonner.privatBil[3] }} />
                <col style={{ width: bredder.kolonner.privatBil[4] }} />
            </colgroup>
            <tbody>
                <tr>
                    <td colSpan={4} style={{ ...cellStyle, fontWeight: 500 }}>
                        Totalsum
                    </td>
                    <td style={{ ...cellStyle, fontWeight: 500 }}>
                        {kronerMedTusenSkilleEllerStrek(summerBeløpForGruppe(gruppe))}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
