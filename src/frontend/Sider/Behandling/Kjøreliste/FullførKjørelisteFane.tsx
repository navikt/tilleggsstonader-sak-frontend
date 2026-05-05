import React, { FC, useCallback, useEffect, useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import styles from './FullførKjørelisteFane.module.css';
import { KjørelisteBrevmeny } from './KjørelisteBrevmeny';
import { useBegrunnelse } from './useBegrunnelse';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import {
    erFeil,
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../komponenter/Feil/feilmeldingUtils';
import { PdfVisning } from '../../../komponenter/PdfVisning';
import {
    byggRessursFeilet,
    byggTomRessurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../typer/ressurs';

export const FullførKjørelisteFane: FC = () => {
    const { request } = useApp();
    const { behandling, behandlingErRedigerbar, hentBehandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { begrunnelseRessurs } = useBegrunnelse(
        !!erStegRedigerbart && behandling.status !== 'FERDIGSTILT'
    );

    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [harUlagredeEndringer, settHarUlagredeEndringer] = useState<boolean>(false);
    const [laster, settLaster] = useState<boolean>(false);

    const [brevPdf, settBrevPdf] = useState(byggTomRessurs<string>());

    const hentEllerGenererBrev = useCallback(
        (begrunnelseVerdi: string | null) => {
            request<string, { begrunnelse: string | null }>(
                `/api/sak/kjorelistebrev/${behandling.id}`,
                behandlingErRedigerbar ? 'POST' : 'GET',
                behandlingErRedigerbar ? { begrunnelse: begrunnelseVerdi } : undefined
            )
                .then(settBrevPdf)
                .catch(() => settBrevPdf(byggRessursFeilet('Kunne ikke laste brev')));
        },
        [behandlingErRedigerbar, behandling.id, request]
    );

    useEffect(() => {
        hentEllerGenererBrev(null);
    }, [hentEllerGenererBrev]);

    const fullfør = () => {
        if (harUlagredeEndringer) {
            settFeilmelding(
                lagFeilmelding(
                    'Du har endret begrunnelsen uten å lagre. Trykk "Lagre begrunnelse" eller fjern teksten før du fullfører.'
                )
            );
            return;
        }
        if (laster) return;
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
        <div className={styles.toKolonner}>
            <VStack gap="space-16">
                {erStegRedigerbart && (
                    <DataViewer type="begrunnelse" response={{ begrunnelseRessurs }}>
                        {({ begrunnelseRessurs }) => (
                            <KjørelisteBrevmeny
                                initialBegrunnelse={begrunnelseRessurs.begrunnelse}
                                settHarUlagredeEndringer={settHarUlagredeEndringer}
                                settBrevPdf={settBrevPdf}
                            />
                        )}
                    </DataViewer>
                )}

                {behandling.status === 'FERDIGSTILT' && (
                    <span>Kjørelister er sendt til utbetaling</span>
                )}

                <Feilmelding feil={feilmelding} />

                {erStegRedigerbart && (
                    <div>
                        <Button variant="primary" loading={laster} onClick={fullfør}>
                            Fullfør kjørelistebehandling
                        </Button>
                    </div>
                )}
            </VStack>
            <PdfVisning pdfFilInnhold={brevPdf} />
        </div>
    );
};
