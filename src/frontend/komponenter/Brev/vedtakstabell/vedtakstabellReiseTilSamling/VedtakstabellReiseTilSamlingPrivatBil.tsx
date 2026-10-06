import React from 'react';

import {
    borderStyle,
    bredder,
    cellStyle,
    cellStyleMedNewline,
    gråOverskrift,
    lagEkstrakostnaderTekst,
    stønadsbeløpCelleStyle,
    stønadsbeløpHeaderStyle,
    stønadsbeløpKolonneBredde,
} from './util';
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
            <thead>
                <tr>
                    <th
                        colSpan={5}
                        style={{
                            ...cellStyle,
                            textAlign: 'left',
                            fontWeight: 500,
                            backgroundColor: gråOverskrift,
                        }}
                    >
                        Privat bil - <strong>{samling.adresse ?? '-'}</strong> -{' '}
                        {formaterIsoPeriodeMedTankestrek(datoperiode)}
                    </th>
                </tr>
                <tr>
                    <th style={{ ...cellStyle, width: bredder.header.privatBil[0] }}>
                        Total reiseavstand
                    </th>
                    <th style={{ ...cellStyle, width: bredder.header.privatBil[1] }}>
                        Kilometersats
                    </th>
                    <th style={{ ...cellStyle, width: bredder.header.privatBil[2] }}>Utgifter</th>
                    <th style={{ ...cellStyle, width: bredder.header.privatBil[3] }}>Parkering</th>
                    <th style={stønadsbeløpHeaderStyle}>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={cellStyle}>{samling.totalReiseavstand} km</td>
                    <td style={cellStyle}>{samling.sats} kr/km</td>
                    <td
                        style={cellStyleMedNewline}
                        dangerouslySetInnerHTML={{ __html: lagEkstrakostnaderTekst(samling) }}
                    />
                    <td style={cellStyle}>{kronerMedTusenSkilleEllerStrek(samling.parkering)}</td>
                    <td style={stønadsbeløpCelleStyle}>
                        {kronerMedTusenSkilleEllerStrek(samling.beløp)}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
