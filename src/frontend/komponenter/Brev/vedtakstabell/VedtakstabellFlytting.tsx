import React, { FC } from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

import { cellStyle } from './vedtakstabellReiseTilSamling/util';
import {
    BeregningsgrunnlagFlytteSelv,
    BeregningsgrunnlagType,
    BeregningsresultatFlytting,
    BeregningsresultatFlyttevilkår,
    hentValgtFlyttebyråTilbud,
} from '../../../typer/vedtak/vedtakFlytting';
import { formaterIsoDato } from '../../../utils/dato';
import { kronerMedTusenSkilleEllerStrek } from '../../../utils/tekstformatering';

type Kolonne = {
    navn: string;
    verdi: string | number;
    erBeløp?: boolean;
    erStønadsbeløp?: boolean;
};

export function lagVedtakstabellFlytting(
    beregningsresultat: BeregningsresultatFlytting | undefined
): string {
    if (!beregningsresultat) return '';

    const resultater = beregningsresultat.resultater
        .filter((resultat) => !resultat.fraTidligereVedtak)
        .sort((a, b) => a.fom.localeCompare(b.fom));

    return renderToStaticMarkup(
        <>
            {resultater.map((resultat, index) => (
                <VedtakstabellFlytting key={index} resultat={resultat} />
            ))}
        </>
    );
}

const VedtakstabellFlytting: FC<{ resultat: BeregningsresultatFlyttevilkår }> = ({ resultat }) => {
    const { grunnlag } = resultat;
    const kolonner: Kolonne[] = [
        { navn: 'Flyttedato', verdi: formaterIsoDato(resultat.fom) },
        ...(grunnlag.type === BeregningsgrunnlagType.FLYTTEBYRÅ
            ? [
                  {
                      navn: 'Flyttebyrå',
                      verdi: hentValgtFlyttebyråTilbud(grunnlag).navn,
                  },
              ]
            : lagKolonnerForEgenKjøring(grunnlag)),
        {
            navn: 'Stønadsbeløp',
            verdi: kronerMedTusenSkilleEllerStrek(resultat.beløp),
            erBeløp: true,
            erStønadsbeløp: true,
        },
    ];

    return (
        <table
            style={{
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
                marginBottom: 16,
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
            }}
        >
            <colgroup>
                {kolonner.map(({ navn, erStønadsbeløp }) => (
                    <col key={navn} style={erStønadsbeløp ? { width: '100px' } : undefined} />
                ))}
            </colgroup>
            <thead>
                <tr className="vedtakstabell-rad">
                    {kolonner.map(({ navn, erBeløp }) => (
                        <th
                            key={navn}
                            scope="col"
                            style={{
                                ...cellStyle,
                                fontSize: '0.90em',
                                textAlign: erBeløp ? 'right' : 'left',
                            }}
                        >
                            {navn}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr className="vedtakstabell-rad">
                    {kolonner.map(({ navn, verdi, erBeløp }) => (
                        <td
                            key={navn}
                            style={{
                                ...cellStyle,
                                fontSize: '0.95em',
                                textAlign: erBeløp ? 'right' : 'left',
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {verdi}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};

function lagKolonnerForEgenKjøring(grunnlag: BeregningsgrunnlagFlytteSelv): Kolonne[] {
    return [
        { navn: 'Avstand', verdi: `${grunnlag.avstandEnVei} km` },
        {
            navn: 'Sats',
            verdi: `${kronerMedTusenSkilleEllerStrek(grunnlag.sats)}/km`,
            erBeløp: true,
        },
        ...[
            { navn: 'Henger', beløp: grunnlag.henger },
            { navn: 'Leiebil', beløp: grunnlag.leiebil },
            { navn: 'Bompenger', beløp: grunnlag.bompenger },
            { navn: 'Ferge', beløp: grunnlag.ferge },
            { navn: 'Parkering', beløp: grunnlag.parkering },
            { navn: 'Annet', beløp: grunnlag.annet },
        ]
            .filter(({ beløp }) => beløp > 0)
            .map(({ navn, beløp }) => ({
                navn,
                verdi: kronerMedTusenSkilleEllerStrek(beløp),
                erBeløp: true,
            })),
    ];
}
