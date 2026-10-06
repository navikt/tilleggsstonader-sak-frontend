import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';

import { fjernPerioderFraTidligereVedtakOgGrupperPåPeriodeOgAdresse, Samlingsgruppe } from './util';
import { VedtakstabellReiseTilSamlingOffentligTransport } from './VedtakstabellReiseTilSamlingOffentligTransport';
import { VedtakstabellReiseTilSamlingPrivatBil } from './VedtakstabellReiseTilSamlingPrivatBil';
import { VedtakstabellReiseTilSamlingTotalsum } from './VedtakstabellReiseTilSamlingTotalsum';
import { BeregningResultatReiseTilSamling } from '../../../../typer/vedtak/vedtakReiseTilSamling';

export const lagVedtakstabellReiseTilSamling = (
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string => {
    if (!beregningsresultat) return '';
    return renderToStaticMarkup(
        <VedtakstabellReiseTilSamling beregningsresultat={beregningsresultat} />
    );
};

const VedtakstabellReiseTilSamling: React.FC<{
    beregningsresultat: BeregningResultatReiseTilSamling;
}> = ({ beregningsresultat }) => {
    const grupper = fjernPerioderFraTidligereVedtakOgGrupperPåPeriodeOgAdresse(beregningsresultat);
    const harPrivatBil = grupper.some((gruppe) => gruppe.privatBil.length > 0);

    const skalViseTotalsumForGruppe = (gruppe: Samlingsgruppe) =>
        gruppe.offentligTransport.length + gruppe.privatBil.length > 1;

    return (
        <>
            {grupper.map((gruppe, index) => (
                <div
                    key={gruppe.nøkkel}
                    style={{
                        marginTop: index === 0 ? 0 : 24,
                        width: harPrivatBil ? '100%' : 'auto',
                        maxWidth: '100%',
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                    }}
                >
                    {gruppe.offentligTransport.map((samling) => (
                        <VedtakstabellReiseTilSamlingOffentligTransport
                            key={samling.reiseId}
                            samling={samling}
                            brukAutoBredde={!harPrivatBil}
                        />
                    ))}
                    {gruppe.privatBil.map((samling) => (
                        <VedtakstabellReiseTilSamlingPrivatBil
                            key={samling.reiseId}
                            samling={samling}
                        />
                    ))}
                    {skalViseTotalsumForGruppe(gruppe) && (
                        <VedtakstabellReiseTilSamlingTotalsum gruppe={gruppe} />
                    )}
                </div>
            ))}
        </>
    );
};
