import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

import {
    borderStyle,
    bredder,
    cellStyle,
    cellStyleMedNewline,
    gråOverskrift,
    stønadsbeløpCelleStyle,
    stønadsbeløpHeaderStyle,
    stønadsbeløpKolonneBredde,
} from './util';
import { BeregningsresultatOffentligTransport } from '../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { kronerMedTusenSkilleEllerStrek } from '../../../../utils/tekstformatering';
import { escapeHtml } from '../utils';

export const VedtakstabellReiseTilSamlingOffentligTransport: React.FC<{
    samling: BeregningsresultatOffentligTransport;
    brukAutoBredde?: boolean;
}> = ({ samling, brukAutoBredde }) => {
    const datoperiode: Periode = { fom: samling.fom, tom: samling.tom };

    return (
        <table
            style={{
                margin: 0,
                width: brukAutoBredde ? 'auto' : '100%',
                maxWidth: '100%',
                tableLayout: brukAutoBredde ? 'auto' : 'fixed',
                borderCollapse: 'collapse',
                border: borderStyle,
            }}
        >
            <colgroup>
                <col
                    style={{
                        width: brukAutoBredde ? undefined : bredder.kolonner.offentligTransport[0],
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
                        Offentlig transport - <strong>{samling.adresse ?? '-'}</strong> -{' '}
                        {formaterIsoPeriodeMedTankestrek(datoperiode)}
                    </th>
                </tr>
                <tr>
                    <th style={cellStyle}>Utgifter</th>
                    <th style={stønadsbeløpHeaderStyle}>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td
                        style={cellStyleMedNewline}
                        dangerouslySetInnerHTML={{ __html: escapeHtml(samling.begrunnelse) }}
                    />
                    <td style={stønadsbeløpCelleStyle}>
                        {kronerMedTusenSkilleEllerStrek(samling.beløp)}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export const vedtakstabellTekst = (samling: BeregningsresultatOffentligTransport): string => {
    return renderToStaticMarkup(
        <VedtakstabellReiseTilSamlingOffentligTransport samling={samling} brukAutoBredde />
    );
};
