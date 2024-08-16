import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading } from '@navikt/ds-react';

import { VilkårperioderResponse } from './typer/vilkårperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';
import { dagerSiden } from '../../../utils/dato';
import { Toggle } from '../../../utils/toggles';

const OppdaterGrunnlagKnapp: React.FC<{
    vilkårperioder: VilkårperioderResponse;
    hentVilkårperioder: () => void;
}> = ({ vilkårperioder, hentVilkårperioder }) => {
    const { request, settToast } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const [laster, settLaster] = useState(false);
    const [feilmeldingOppdaterGrunnlag, settFeilmeldingOppdaterGrunnlag] = useState<string>();

    const isEnabled = useFlag(Toggle.KAN_OPPDATERE_GRUNNLAG_VILKÅRPERIODE);

    if (!isEnabled) {
        return null;
    }

    const oppdaterGrunnlag = () => {
        if (laster) {
            return;
        }
        settFeilmeldingOppdaterGrunnlag(undefined);
        settLaster(true);
        request<VilkårperioderResponse, null>(
            `/api/sak/vilkarperiode/behandling/${behandling.id}/oppdater-grunnlag`,
            'POST'
        )
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    settToast(Toast.OPPDATERT_GRUNNLAG_VILKÅRPERIODE);
                    hentVilkårperioder();
                } else {
                    settFeilmeldingOppdaterGrunnlag(
                        `Oppdatering av grunnlag feilet: ${response.frontendFeilmelding}`
                    );
                }
            })
            .finally(() => settLaster(false));
    };

    if (!erStegRedigerbart || !vilkårperioder.grunnlag) {
        return null;
    }
    const button = (
        <>
            <Button
                size={'xsmall'}
                icon={<ArrowsCirclepathIcon />}
                variant={'tertiary'}
                onClick={oppdaterGrunnlag}
                disabled={laster}
            >
                Hent aktiviteter og ytelser på nytt
            </Button>
            <Feilmelding size={'small'}>{feilmeldingOppdaterGrunnlag}</Feilmelding>
        </>
    );
    const tidspunktHentet = vilkårperioder.grunnlag.hentetInformasjon.tidspunktHentet;
    const dagerSidenGrunnlagBleHentet = dagerSiden(new Date(), tidspunktHentet);
    if (dagerSidenGrunnlagBleHentet > 0) {
        return (
            <Alert variant={'warning'}>
                <Heading size={'xsmall'} level="3">
                    Det har gått {dagerSidenGrunnlagBleHentet}{' '}
                    {dagerSidenGrunnlagBleHentet > 1 ? 'dager' : 'dag'} siden aktivitet og ytelse
                    ble hentet.
                </Heading>
                Informasjonen kan være utdatert. Vi anbefaler at du henter inn på nytt.
                {button}
            </Alert>
        );
    }
    return <div>{button}</div>;
};

export default OppdaterGrunnlagKnapp;
