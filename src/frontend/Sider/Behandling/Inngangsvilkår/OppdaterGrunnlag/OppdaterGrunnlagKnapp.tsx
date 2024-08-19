import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HStack } from '@navikt/ds-react';

import { useOppdaterGrunnlag } from './useOppdaterGrunnlag';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { dagerSiden } from '../../../../utils/dato';
import { Toggle } from '../../../../utils/toggles';
import { VilkårperioderResponse } from '../typer/vilkårperiode';

const OppdaterGrunnlagKnapp: React.FC<{
    vilkårperioder: VilkårperioderResponse;
    hentVilkårperioder: () => void;
}> = ({ vilkårperioder, hentVilkårperioder }) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterGrunnlag, laster, feilmelding } = useOppdaterGrunnlag(hentVilkårperioder);

    const isEnabled = useFlag(Toggle.KAN_OPPDATERE_GRUNNLAG_VILKÅRPERIODE);

    if (!isEnabled) {
        return null;
    }
    if (!erStegRedigerbart || !vilkårperioder.grunnlag) {
        return null;
    }

    const knapp = (tekst: string) => (
        <>
            <Button
                size={'xsmall'}
                icon={<ArrowsCirclepathIcon />}
                variant={'tertiary'}
                onClick={oppdaterGrunnlag}
                disabled={laster}
            >
                {tekst}
            </Button>
            <Feilmelding size={'small'}>{feilmelding}</Feilmelding>
        </>
    );

    const tidspunktHentet = vilkårperioder.grunnlag.hentetInformasjon.tidspunktHentet;
    const dagerSidenGrunnlagBleHentet = dagerSiden(new Date(), tidspunktHentet);

    if (dagerSidenGrunnlagBleHentet > 0) {
        return (
            <Alert variant={'warning'} size={'small'}>
                <Heading size={'xsmall'} level="3">
                    Det har gått {dagerSidenGrunnlagBleHentet}{' '}
                    {dagerSidenGrunnlagBleHentet > 1 ? 'dager' : 'dag'} siden aktivitet og ytelse
                    ble hentet
                </Heading>
                <HStack>
                    <span>
                        Informasjonen kan være utdatert. Vi anbefaler at du henter inn på nytt.
                    </span>
                    {knapp('Hent på nytt')}
                </HStack>
            </Alert>
        );
    }
    return <div>{knapp('Hent saksopplysninger om aktiviteter og ytelser på nytt')}</div>;
};

export default OppdaterGrunnlagKnapp;
