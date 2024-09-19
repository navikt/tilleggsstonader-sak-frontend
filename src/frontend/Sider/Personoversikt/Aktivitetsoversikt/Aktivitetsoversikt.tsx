import React, { useEffect, useState } from 'react';

import { Heading } from '@navikt/ds-react';

import AktiviteterTabell from './Aktiviteter';
import { AktiviteterDto } from './AktiviteterDto';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterTilTekstligDato } from '../../../utils/dato';

const Aktivitetsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [aktiviteter, settAktiviteter] = useState<Ressurs<AktiviteterDto>>(byggHenterRessurs());

    useEffect(() => {
        request<AktiviteterDto, null>(`/api/sak/aktivitet/temp/${fagsakPersonId}`, 'GET').then(
            settAktiviteter
        );
    }, [request, fagsakPersonId]);

    return (
        <DataViewer response={{ aktiviteter }}>
            {({ aktiviteter }) => (
                <>
                    <Heading size="small" spacing>
                        Arbeidsrettede aktiviteter fra og med{' '}
                        {formaterTilTekstligDato(aktiviteter.periodeHentetFra)}
                    </Heading>
                    <AktiviteterTabell aktiviteter={aktiviteter.aktiviteter} />
                </>
            )}
        </DataViewer>
    );
};

export default Aktivitetsoversikt;
