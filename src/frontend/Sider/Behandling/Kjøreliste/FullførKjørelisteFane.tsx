import React, { FC, useCallback, useEffect, useState } from 'react';

import { BodyShort, Button, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import {
    erFeil,
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../komponenter/Feil/feilmeldingUtils';
import { PdfVisning } from '../../../komponenter/PdfVisning';
import {
    byggTomRessurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../typer/ressurs';

export const FullførKjørelisteFane: FC = () => {
    const { request } = useApp();
    const { behandling, behandlingErRedigerbar, hentBehandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const [laster, settLaster] = useState<boolean>(false);

    const [brevPdf, settBrevPdf] = useState(byggTomRessurs<string>());

    const hentBrevCallback = useCallback(() => {
        request<string, null>(
            `/api/sak/kjorelistebrev/${behandling.id}`,
            behandlingErRedigerbar ? 'POST' : 'GET'
        ).then(settBrevPdf);
    }, [behandlingErRedigerbar, behandling.id, request]);

    useEffect(hentBrevCallback, [hentBrevCallback]);

    const fullfør = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        request<null, null>(
            `/api/sak/behandling/${behandling.id}/fullfør-kjørelistebehandling`,
            'POST'
        )
            .then((res: RessursSuksess<null> | RessursFeilet) => {
                settFeilmelding(undefined);
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    return Promise.resolve();
                } else {
                    return Promise.reject(feiletRessursTilFeilmelding(res));
                }
            })
            .catch((error) =>
                erFeil(error)
                    ? settFeilmelding(error)
                    : settFeilmelding(lagFeilmelding('Ukjent feil oppstod'))
            )
            .finally(() => settLaster(false));
    };

    return (
        <VStack gap="space-16">
            {behandling.status === 'FERDIGSTILT' && (
                <BodyShort>Kjørelister er sendt til utbetaling</BodyShort>
            )}

            <Feilmelding feil={feilmelding} />

            {erStegRedigerbart && (
                <div>
                    <Button variant="primary" loading={laster} onClick={fullfør}>
                        Fullfør kjørelistebehandling
                    </Button>
                </div>
            )}
            <PdfVisning pdfFilInnhold={brevPdf} />
        </VStack>
    );
};
