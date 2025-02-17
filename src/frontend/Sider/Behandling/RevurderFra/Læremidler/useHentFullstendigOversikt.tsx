import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { InnvilgelseLæremidler, VedtakLæremidler } from '../../../../typer/vedtak/vedtakLæremidler';

export const useHentFullstendigOversikt = (
    forrigeBehandlingId: string
): {
    vedtakLæremidler: Ressurs<VedtakLæremidler>;
} => {
    const { request } = useApp();

    const [vedtakLæremidler, setVedtakLæremidler] =
        useState<Ressurs<VedtakLæremidler>>(byggTomRessurs());

    const hentForrigeVedtakMedFullHistorikk = useCallback(
        (forrigeBehandlingId: string) => {
            request<InnvilgelseLæremidler, null>(
                `/api/sak/vedtak/laremidler/fullstendig-oversikt/${forrigeBehandlingId}`
            ).then(setVedtakLæremidler);
        },
        [request]
    );
    useEffect(() => {
        hentForrigeVedtakMedFullHistorikk(forrigeBehandlingId);
    }, [forrigeBehandlingId, hentForrigeVedtakMedFullHistorikk]);

    return {
        vedtakLæremidler: vedtakLæremidler,
    };
};
