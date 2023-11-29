import React from 'react';

import { PortableText } from '@portabletext/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CustomComponets } from './Delmal';
import { FritekstAvsnitt, MalStruktur, Valg } from './typer';
import { NavIkon } from '../../../komponenter/Ikoner/Brev/NavIkon';

export const lagHtmlStringAvBrev = (props: Props): string =>
    renderToStaticMarkup(<HtmlBrev {...props} />);

interface Props {
    navn: string;
    personIdent: string;
    mal: MalStruktur;
    inkluderteDelmaler: Record<string, boolean>;
    valgfelt: Partial<Record<string, Record<string, Valg>>>;
    variabler: Partial<Record<string, Record<string, string>>>;
    fritekst: Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>;
    inkluderBeslutterSignaturPlaceholder?: boolean;
}

const saksbehandlerSignaturPlaceholder = 'SAKSBEHANDLER_SIGNATUR';
const beslutterSignaturPlaceholder = 'BESLUTTER_SIGNATUR';
const brevOpprettetDatoPlaceholder = 'BESLUTTER_VEDTAKSDATO';

const HtmlBrev: React.FC<Props> = ({
    navn,
    personIdent,
    valgfelt,
    variabler,
    fritekst,
    mal,
    inkluderteDelmaler,
    inkluderBeslutterSignaturPlaceholder = true,
}) => (
    <html lang={'nb'}>
        <head>
            <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
            <title>{mal.brevtittel}</title>
        </head>
        <body
            style={{
                fontFamily: 'Source Sans Pro sans-serif',
                fontSize: '12pt',
                lineHeight: '1.4em',
                margin: 0,
                boxSizing: 'border-box',
            }}
        >
            <div>
                <div className={'header'}>
                    <div className="ikon-og-dato">
                        <NavIkon />
                        {/* placeholder i tilfelle brevet besluttes annen dag enn det lages */}
                        <p>{brevOpprettetDatoPlaceholder}</p>{' '}
                    </div>
                    <div className={'tittel-og-personinfo'}>
                        <h2 className="tittel">{mal.brevtittel.toUpperCase()}</h2>
                        <div className="kolonner">
                            <div className="personinfo">
                                <div>Navn: {navn}</div>
                                <div>Fødselsnummer: {personIdent}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {mal.delmaler
                        .filter((delmal) => inkluderteDelmaler[delmal._id])
                        .map((delmal) => (
                            <PortableText
                                key={delmal._id}
                                value={delmal.blocks}
                                components={CustomComponets(
                                    valgfelt[delmal._id] || {},
                                    variabler[delmal._id] || {},
                                    fritekst[delmal._id] || {}
                                )}
                            />
                        ))}
                </div>
                <div style={{ marginRight: '20px' }}>
                    <span>{saksbehandlerSignaturPlaceholder}</span>
                    {inkluderBeslutterSignaturPlaceholder && (
                        <span style={{ marginLeft: '20px' }}>{beslutterSignaturPlaceholder}</span>
                    )}
                </div>
            </div>
        </body>
    </html>
);
