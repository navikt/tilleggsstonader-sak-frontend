import React from 'react';

import { bredder, cellStyle, gråOverskrift, lagEkstrakostnaderTekst } from './util';
import { BeregningsresultatPrivatBil } from '../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { kronerMedTusenSkilleEllerStrek } from '../../../../utils/tekstformatering';

export const VedtakstabellReiseTilSamlingPrivatBil: React.FC<{
    samling: BeregningsresultatPrivatBil;
}> = ({ samling }) => {
    const datoperiode: Periode = { fom: samling.fom, tom: samling.tom };

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
            </colgroup>
            <thead>
                <tr>
                    <th
                        colSpan={4}
                        style={{
                            ...cellStyle,
                            textAlign: 'left',
                            fontWeight: 500,
                            backgroundColor: gråOverskrift,
                        }}
                    >
                        {formaterIsoPeriodeMedTankestrek(datoperiode)} - Privat bil -{' '}
                        <strong>{samling.adresse ?? '-'}</strong>
                    </th>
                </tr>
                <tr>
                    <th style={cellStyle}>Total reiseavstand</th>
                    <th style={cellStyle}>Kilometersats</th>
                    <th style={cellStyle}>Ekstrautgifter</th>
                    <th style={cellStyle}>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={cellStyle}>{samling.totalReiseavstand} km</td>
                    <td style={cellStyle}>{samling.sats} kr/km</td>
                    <td
                        style={cellStyle}
                        dangerouslySetInnerHTML={{ __html: lagEkstrakostnaderTekst(samling) }}
                    />
                    <td style={cellStyle}>{kronerMedTusenSkilleEllerStrek(samling.beløp)}</td>
                </tr>
            </tbody>
        </table>
    );
};
