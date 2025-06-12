import React, { useCallback, useEffect, useState } from 'react';

import { Detail, Heading } from '@navikt/ds-react';

import AktiviteterTabell from './Aktiviteter';
import { AktiviteterDto } from './AktiviteterDto';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterDatoMedTidspunkt, formaterTilTekstligDato } from '../../../utils/dato';

const Aktivitetsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [aktiviteter, settAktiviteter] = useState<Ressurs<AktiviteterDto>>(byggHenterRessurs());

    const [oppdatertTidspunkt, settOppdatertTidspunkt] = useState<Date | undefined>();

    const hentAktiviter = useCallback(async () => {
        const response = request<AktiviteterDto, null>(
            `/api/sak/register-aktivitet2/${fagsakPersonId}`,
            'GET'
        );
        settAktiviteter(await response);
    }, [fagsakPersonId, request]);

    useEffect(() => {
        hentAktiviter().then(() => settOppdatertTidspunkt(new Date()));
    }, [fagsakPersonId, hentAktiviter]);

    return (
        <DataViewer type={'aktiviteter'} response={{ aktiviteter }}>
            {({ aktiviteter }) => (
                <>
                    <Heading size="small" spacing>
                        Arbeidsrettede aktiviteter fra og med{' '}
                        {formaterTilTekstligDato(aktiviteter.periodeHentetFra)}
                    </Heading>
                    <AktiviteterTabell aktiviteter={aktiviteter.aktiviteter} />
                    <Detail>Oppdatert: {formaterDatoMedTidspunkt(oppdatertTidspunkt)}</Detail>
                </>
            )}
        </DataViewer>
    );
};

export default Aktivitetsoversikt;
