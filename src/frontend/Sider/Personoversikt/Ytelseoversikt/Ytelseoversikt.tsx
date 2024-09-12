import React, { useEffect, useState } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import YtelserTabell from './YtelserTabell';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Registerytelser, registerYtelseTilTekst } from '../../../typer/registerytelser';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterIsoDatoTid, formaterTilTekstligDato } from '../../../utils/dato';

const formaterYtelsesHeader = (ytelser: Registerytelser) => {
    const infotyper = ytelser.hentetInformasjon.map((info) => registerYtelseTilTekst[info.type]);
    const sisteType = infotyper.pop();
    const dato = formaterTilTekstligDato(ytelser.tidspunktHentet);
    return 'Perioder med ' + infotyper.join(', ') + ' eller ' + sisteType + ' fra og med ' + dato;
};

const Ytelseoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [ytelser, settYtelser] = useState<Ressurs<Registerytelser>>(byggHenterRessurs());

    useEffect(() => {
        request<Registerytelser, null>(`/api/sak/ytelse/${fagsakPersonId}`, 'GET').then(
            settYtelser
        );
    }, [request, fagsakPersonId]);

    return (
        <DataViewer response={{ ytelser }}>
            {({ ytelser }) => (
                <>
                    <Heading size={'xsmall'}>{formaterYtelsesHeader(ytelser)}</Heading>
                    <Alert variant={'info'} size={'small'} inline>
                        Informasjon hentet: {formaterIsoDatoTid(ytelser.tidspunktHentet)}.
                    </Alert>
                    {ytelser.hentetInformasjon
                        .filter((info) => info.status === 'FEILET')
                        .map((hentetInformasjon) => (
                            <Alert
                                key={hentetInformasjon.type}
                                variant={'warning'}
                                size={'small'}
                                inline
                            >
                                Feilet ved henting av informasjon fra{' '}
                                {registerYtelseTilTekst[hentetInformasjon.type]}
                            </Alert>
                        ))}
                    <YtelserTabell perioder={ytelser.perioder} />
                </>
            )}
        </DataViewer>
    );
};

export default Ytelseoversikt;
