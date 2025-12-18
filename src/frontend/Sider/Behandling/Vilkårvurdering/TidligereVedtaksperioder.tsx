import React from 'react';

import { TidligereVedtaksperioderTS } from './TidligereVedtaksperioderTS';
import { useHentFullstendigVedtaksOversiktForStønad } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingFakta } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

type Props = {
    behandlingFakta: BehandlingFakta;
    behandlingId: string | undefined;
    stønadstype: Stønadstype;
    sluttdatoForrigeVedtak: string | undefined;
};

export function TidligereVedtaksperioder({
    behandlingFakta,
    behandlingId,
    stønadstype,
    sluttdatoForrigeVedtak,
}: Props) {
    const sluttdatoPåVedtakIArena = behandlingFakta.arena?.vedtakTom;

    const { vedtaksperioderOversiktForStønad } =
        useHentFullstendigVedtaksOversiktForStønad(behandlingId);

    return (
        <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversiktForStønad }}>
            {({ vedtaksperioderOversiktForStønad }) => (
                <>
                    {vedtaksperioderOversiktForStønad ? (
                        <TidligereVedtaksperioderTS
                            stønadstype={stønadstype}
                            sluttdatoPåVedtakIArena={sluttdatoPåVedtakIArena}
                            sluttdatoForrigeVedtak={sluttdatoForrigeVedtak}
                            vedtaksperioderOversiktForStønad={vedtaksperioderOversiktForStønad}
                        />
                    ) : (
                        sluttdatoPåVedtakIArena && (
                            <VarselVedtakIArena arenaVedtakTom={sluttdatoPåVedtakIArena} />
                        )
                    )}
                </>
            )}
        </DataViewer>
    );
}
