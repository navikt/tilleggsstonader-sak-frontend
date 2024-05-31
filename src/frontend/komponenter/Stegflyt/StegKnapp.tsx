import React, { FC, useEffect, useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import { FanePath } from '../../Sider/Behandling/faner';
import { Steg, stegErEtterAnnetSteg } from '../../typer/behandling/steg';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';

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
    children: React.ReactNode;
}> = ({ nesteFane, steg, onNesteSteg, validerUlagedeKomponenter = true, children }) => {
    const navigate = useNavigateUtenSjekkForUlagredeKomponenter();
    const { request, harUlagradeKomponenter } = useApp();

    const { behandling, behandlingErRedigerbar, hentBehandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>();

    useEffect(() => {
        if (!harUlagradeKomponenter && feilmelding === feilmeldingUlagretData) {
            settFeilmelding(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [harUlagradeKomponenter]);

    const redigerSteg = () => {
        settFeilmelding(undefined);
        request<string, { steg: Steg }>(`/api/sak/steg/behandling/${behandling.id}/reset`, 'POST', {
            steg: steg,
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(`Kunne ikke redigere steg: ${res.frontendFeilmelding}`);
            }
        });
    };

    const gåTilNesteSteg = () => {
        if (validerUlagedeKomponenter && harUlagradeKomponenter) {
            settFeilmelding(feilmeldingUlagretData);
            return;
        }
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
        håndterSteg.then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
                navigate(`/behandling/${behandling.id}/${nesteFane}`);
            } else {
                settFeilmelding(`Kunne ikke gå til neste steg: ${res.frontendFeilmelding}`);
            }
        });
    };

    if (!behandlingErRedigerbar) {
        return null;
    }

    return (
        <VStack align={'start'}>
            {behandling.steg === steg && (
                <Button variant="primary" size="small" onClick={gåTilNesteSteg}>
                    {children}
                </Button>
            )}
            {stegErEtterAnnetSteg(behandling.steg, steg) && (
                <Button variant="secondary" size="small" onClick={redigerSteg}>
                    Rediger steg
                </Button>
            )}
            <Feilmelding>{feilmelding}</Feilmelding>
        </VStack>
    );
};
