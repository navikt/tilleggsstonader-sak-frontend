import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

import { bredder, cellStyle, gråOverskrift, stønadsbeløpKolonneBredde } from './util';
import { BeregningsresultatOffentligTransport } from '../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { kronerMedTusenSkilleEllerStrek } from '../../../../utils/tekstformatering';
import { escapeHtml } from '../utils';

export const VedtakstabellReiseTilSamlingOffentligTransport: React.FC<{
    samling: BeregningsresultatOffentligTransport;
}> = ({ samling }) => {
    const datoperiode: Periode = { fom: samling.fom, tom: samling.tom };

    return (
        <table
            style={{
                margin: 0,
                width: '100%',
                maxWidth: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
            }}
        >
            <colgroup>
                <col
                    style={{
                        width: bredder.kolonner.offentligTransport[0],
                    }}
                />
                <col style={{ width: stønadsbeløpKolonneBredde }} />
            </colgroup>
            <thead>
                <tr>
                    <th
                        colSpan={2}
                        style={{
                            ...cellStyle,
                            textAlign: 'left',
                            fontWeight: 500,
                            backgroundColor: gråOverskrift,
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {formaterIsoPeriodeMedTankestrek(datoperiode)} - Offentlig transport -{' '}
                        <strong>{samling.adresse ?? '-'}</strong>
                    </th>
                </tr>
                <tr>
                    <th style={cellStyle}>Utgifter</th>
                    <th style={cellStyle}>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        style={cellStyle}
                        dangerouslySetInnerHTML={{ __html: escapeHtml(samling.begrunnelse) }}
                    />
                    <td style={cellStyle}>{kronerMedTusenSkilleEllerStrek(samling.beløp)}</td>
                </tr>
            </tbody>
        </table>
    );
};

export const vedtakstabellTekst = (samling: BeregningsresultatOffentligTransport): string => {
    return renderToStaticMarkup(
        <VedtakstabellReiseTilSamlingOffentligTransport samling={samling} />
    );
};
