import React, { FC, useCallback, useEffect, useState } from 'react';

import { Button, ExpansionCard, HStack, Textarea, VStack } from '@navikt/ds-react';

import styles from './FullførKjørelisteFane.module.css';
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
    const [begrunnelseFeil, settBegrunnelseFeil] = useState<Feil>();

    const [laster, settLaster] = useState<boolean>(false);
    const [lasterBegrunnelse, settLasterBegrunnelse] = useState<boolean>(false);
    const [begrunnelse, settBegrunnelse] = useState<string>('');
    const [harUlagredeEndringer, settHarUlagredeEndringer] = useState<boolean>(false);

    const [brevPdf, settBrevPdf] = useState(byggTomRessurs<string>());

    const hentEllerGenererBrev = useCallback(
        (begrunnelseVerdi: string | null) => {
            request<string, { begrunnelse: string | null }>(
                `/api/sak/kjorelistebrev/${behandling.id}`,
                behandlingErRedigerbar ? 'POST' : 'GET',
                behandlingErRedigerbar ? { begrunnelse: begrunnelseVerdi } : undefined
            ).then(settBrevPdf);
        },
        [behandlingErRedigerbar, behandling.id, request]
    );

    useEffect(() => {
        hentEllerGenererBrev(null);
    }, [hentEllerGenererBrev]);

    const lagreBegrunnelse = () => {
        if (lasterBegrunnelse) return;
        settLasterBegrunnelse(true);
        request<string, { begrunnelse: string | null }>(
            `/api/sak/kjorelistebrev/${behandling.id}`,
            'POST',
            { begrunnelse: begrunnelse }
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settBrevPdf(res);
                    settHarUlagredeEndringer(false);
                    settBegrunnelseFeil(undefined);
                } else {
                    settBegrunnelseFeil(feiletRessursTilFeilmelding(res as RessursFeilet));
                }
            })
            .catch((error) =>
                erFeil(error)
                    ? settBegrunnelseFeil(error)
                    : settBegrunnelseFeil(lagFeilmelding('Ukjent feil oppstod'))
            )
            .finally(() => settLasterBegrunnelse(false));
    };

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
                    <div className={styles.background}>
                        <ExpansionCard aria-label="Begrunnelse" size="small" defaultOpen>
                            <ExpansionCard.Header>
                                <HStack wrap={false} align="center" gap="space-8">
                                    <ExpansionCard.Title size="small">
                                        Begrunnelse
                                    </ExpansionCard.Title>
                                </HStack>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <div className={styles.container}>
                                    <Textarea
                                        label="Begrunnelse for vedtaket"
                                        hideLabel
                                        value={begrunnelse}
                                        onChange={(e) => {
                                            settBegrunnelse(e.target.value);
                                            settHarUlagredeEndringer(true);
                                        }}
                                        minRows={3}
                                    />
                                    <Feilmelding feil={begrunnelseFeil} />
                                    <HStack>
                                        <Button
                                            variant="secondary"
                                            loading={lasterBegrunnelse}
                                            onClick={lagreBegrunnelse}
                                            size="small"
                                        >
                                            Lagre begrunnelse
                                        </Button>
                                    </HStack>
                                </div>
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    </div>
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
