import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { InnvilgelseLæremidler, VedtakLæremidler } from '../../../../typer/vedtak/vedtakLæremidler';

export const useHentFullstendigOversikt = (
    forrigeIverksatteBehandlingId: string
): {
    vedtakLæremidler: Ressurs<VedtakLæremidler>;
} => {
    const { request } = useApp();

    const [vedtakLæremidler, setVedtakLæremidler] =
        useState<Ressurs<VedtakLæremidler>>(byggTomRessurs());

    const hentForrigeVedtakMedFullHistorikk = useCallback(
        (forrigeIverksatteBehandlingId: string) => {
            request<InnvilgelseLæremidler, null>(
                `/api/sak/vedtak/laremidler/fullstendig-oversikt/${forrigeIverksatteBehandlingId}`
            ).then(setVedtakLæremidler);
        },
        [request]
    );
    useEffect(() => {
        hentForrigeVedtakMedFullHistorikk(forrigeIverksatteBehandlingId);
    }, [forrigeIverksatteBehandlingId, hentForrigeVedtakMedFullHistorikk]);

    return {
        vedtakLæremidler: vedtakLæremidler,
    };
};
