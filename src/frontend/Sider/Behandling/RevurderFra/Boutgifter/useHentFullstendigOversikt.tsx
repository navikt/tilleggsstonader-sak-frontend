import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { DetaljertVedtaksperiodeBoutgifter } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';

export const useHentFullstendigOversikt = (
    forrigeIverksatteBehandlingId: string
): {
    detaljerteVedtaksperioderBoutgifter: Ressurs<DetaljertVedtaksperiodeBoutgifter[]>;
} => {
    const { request } = useApp();

    const [vedtakBoutgifter, setVedtakBoutgifter] =
        useState<Ressurs<DetaljertVedtaksperiodeBoutgifter[]>>(byggTomRessurs());

    const hentForrigeVedtakMedFullHistorikk = useCallback(
        (forrigeIverksatteBehandlingId: string) => {
            request<DetaljertVedtaksperiodeBoutgifter[], null>(
                `/api/sak/vedtak/boutgifter/fullstendig-oversikt/${forrigeIverksatteBehandlingId}`
            ).then(setVedtakBoutgifter);
        },
        [request]
    );
    useEffect(() => {
        hentForrigeVedtakMedFullHistorikk(forrigeIverksatteBehandlingId);
    }, [forrigeIverksatteBehandlingId, hentForrigeVedtakMedFullHistorikk]);

    return {
        detaljerteVedtaksperioderBoutgifter: vedtakBoutgifter,
    };
};
