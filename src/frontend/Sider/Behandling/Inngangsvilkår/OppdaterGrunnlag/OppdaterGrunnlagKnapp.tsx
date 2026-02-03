import React, { useState } from 'react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, Button, Detail, Heading, HStack } from '@navikt/ds-react';

import styles from './OppdaterGrunnlagKnapp.module.css';
import { useOppdaterGrunnlag } from './useOppdaterGrunnlag';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { dagerSiden } from '../../../../utils/dato';
import { VilkårperioderResponse } from '../typer/vilkårperiode/vilkårperiode';

export const OppdaterGrunnlagKnapp: React.FC<{
    vilkårperioder: VilkårperioderResponse;
    hentVilkårperioder: () => void;
}> = ({ vilkårperioder, hentVilkårperioder }) => {
    const { visRedigerGrunnlagFomAdmin, settVisRedigerGrunnlagFomAdmin } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { oppdaterGrunnlag, laster, feilmelding } = useOppdaterGrunnlag(hentVilkårperioder);
    const [grunnlagHentFom, settGrunnlagHentFom] = useState<string | undefined>();

    if (!erStegRedigerbart || !vilkårperioder.grunnlag) {
        return null;
    }

    const knapp = (tekst: string) => (
        <>
            <Button
                size={'xsmall'}
                icon={<ArrowsCirclepathIcon />}
                variant={'tertiary'}
                onClick={() => {
                    oppdaterGrunnlag(grunnlagHentFom);
                    settVisRedigerGrunnlagFomAdmin(false);
                }}
                disabled={laster}
            >
                {tekst}
            </Button>
            {visRedigerGrunnlagFomAdmin && (
                <div className={styles.adminEndreHenteGrunnlagFra}>
                    <DateInput
                        label={'Dato saksopplysninger hentes fra og med'}
                        size={'small'}
                        value={vilkårperioder.grunnlag?.hentetInformasjon?.fom}
                        onChange={settGrunnlagHentFom}
                    />
                    <Detail>
                        Trykk på Hent-knappen for å hente grunnlag fra og med valgt dato
                    </Detail>
                </div>
            )}
        </>
    );

    const tidspunktHentet = vilkårperioder.grunnlag.hentetInformasjon.tidspunktHentet;
    const dagerSidenGrunnlagBleHentet = dagerSiden(new Date(), tidspunktHentet);

    if (dagerSidenGrunnlagBleHentet > 0) {
        return (
            <>
                <Alert variant={'warning'} size={'small'}>
                    <Heading size={'xsmall'} level="3">
                        Det har gått {dagerSidenGrunnlagBleHentet}{' '}
                        {dagerSidenGrunnlagBleHentet > 1 ? 'dager' : 'dag'} siden aktivitet og
                        ytelse ble hentet
                    </Heading>
                    <HStack>
                        <span>
                            Informasjonen kan være utdatert. Vi anbefaler at du henter inn på nytt.
                        </span>
                        {knapp('Hent på nytt')}
                    </HStack>
                </Alert>
                <Feilmelding feil={feilmelding} />
            </>
        );
    }
    return <div>{knapp('Hent saksopplysninger om aktiviteter og ytelser på nytt')}</div>;
};
