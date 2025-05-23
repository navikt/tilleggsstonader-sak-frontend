import React, { FC, useEffect, useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import { StegBekreftelseModal, StegKnappBekreftelsesModal } from './StegKnappBekreftelsesModal';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { useSteg } from '../../context/StegContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import { FanePath } from '../../Sider/Behandling/faner';
import { Steg, stegErEtterAnnetSteg } from '../../typer/behandling/steg';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';
import { feiletRessursTilFeilmelding, Feil, lagFeilmelding } from '../Feil/feilmeldingUtils';

const feilmeldingUlagretData = 'Har ulagret data, vennligst ferdigstill';

/**
 *
 * @param validerUlagedeKomponenter default true, settes til false når man eks på vedtakssiden lagrer ned data via "gå til neste steg" og då ikke trenger å validere ulagret data
 */
export const StegKnapp: FC<{
    nesteFane: FanePath;
    steg: Steg;
    onNesteSteg?: () => Promise<RessursSuksess<unknown> | RessursFeilet>;
    validerUlagedeKomponenter?: boolean;
    bekreftelseModalProps?: StegBekreftelseModal;
    children: React.ReactNode;
}> = ({
    nesteFane,
    steg,
    onNesteSteg,
    validerUlagedeKomponenter = true,
    bekreftelseModalProps,
    children,
}) => {
    const navigate = useNavigateUtenSjekkForUlagredeKomponenter();
    const { request, harUlagradeKomponenter } = useApp();

    const { behandling, behandlingErRedigerbar, hentBehandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil | undefined>();
    const [visModal, settVisModal] = useState<boolean>(false);

    useEffect(() => {
        if (!harUlagradeKomponenter && feilmelding?.feilmelding === feilmeldingUlagretData) {
            settFeilmelding(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [harUlagradeKomponenter]);

    const redigerSteg = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        settFeilmelding(undefined);
        request<string, { steg: Steg }>(`/api/sak/steg/behandling/${behandling.id}/reset`, 'POST', {
            steg: steg,
        })
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                } else {
                    settFeilmelding(feiletRessursTilFeilmelding(res, 'Kunne ikke redigere steg'));
                }
            })
            .finally(() => settLaster(false));
    };

    const gåTilNesteSteg = () => {
        if (laster) {
            return;
        }
        if (validerUlagedeKomponenter && harUlagradeKomponenter) {
            settFeilmelding(lagFeilmelding(feilmeldingUlagretData, 'Kunne ikke gå til neste steg'));
            return;
        }
        settLaster(true);
        settFeilmelding(undefined);
        const håndterSteg = onNesteSteg
            ? onNesteSteg()
            : request<string, { steg: Steg }>(
                  `/api/sak/steg/behandling/${behandling.id}/ferdigstill`,
                  'POST',
                  {
                      steg: behandling.steg,
                  }
              );
        håndterSteg
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    navigate(`/behandling/${behandling.id}/${nesteFane}`);
                } else {
                    settFeilmelding(
                        feiletRessursTilFeilmelding(res, 'Kunne ikke gå til neste steg')
                    );
                }
            })
            .finally(() => settLaster(false));
    };

    if (!behandlingErRedigerbar) {
        return null;
    }

    return (
        <VStack align="start" gap="4">
            <Feilmelding feil={feilmelding} />
            {behandling.steg === steg && erStegRedigerbart && (
                <>
                    <StegKnappBekreftelsesModal
                        modalProps={bekreftelseModalProps}
                        gåTilNesteSteg={gåTilNesteSteg}
                        visModal={visModal}
                        settVisModal={settVisModal}
                    />
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => {
                            if (bekreftelseModalProps) {
                                settVisModal(true);
                            } else {
                                gåTilNesteSteg();
                            }
                        }}
                        disabled={laster}
                    >
                        {children}
                    </Button>
                </>
            )}
            {stegErEtterAnnetSteg(behandling.steg, steg) && (
                <Button variant="secondary" size="small" onClick={redigerSteg} disabled={laster}>
                    Rediger steg
                </Button>
            )}
        </VStack>
    );
};
