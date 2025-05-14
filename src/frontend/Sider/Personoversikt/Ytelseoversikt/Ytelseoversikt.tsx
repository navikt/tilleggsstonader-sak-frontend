import React, { useCallback, useEffect, useState } from 'react';

import { Alert, Detail, Heading } from '@navikt/ds-react';

import YtelserTabell from './YtelserTabell';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Registerytelser, registerYtelseTilTekst } from '../../../typer/registerytelser';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterDatoMedTidspunkt, formaterTilTekstligDato } from '../../../utils/dato';

const formaterYtelsesHeader = (ytelser: Registerytelser) => {
    const infotyper = ytelser.kildeResultat.map((info) => registerYtelseTilTekst[info.type]);
    const sisteType = infotyper.pop();
    const dato = formaterTilTekstligDato(ytelser.tidspunktHentet);
    return 'Perioder med ' + infotyper.join(', ') + ' eller ' + sisteType + ' fra og med ' + dato;
};

const Ytelseoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [ytelser, settYtelser] = useState<Ressurs<Registerytelser>>(byggHenterRessurs());

    const [oppdatertTidspunkt, settOppdatertTidspunkt] = useState<Date | undefined>();

    const hentYtelser = useCallback(async () => {
        const response = request<Registerytelser, null>(`/api/sak/ytelse/${fagsakPersonId}`, 'GET');
        settYtelser(await response);
    }, [fagsakPersonId, request]);

    useEffect(() => {
        hentYtelser().then(() => settOppdatertTidspunkt(new Date()));
    }, [fagsakPersonId, hentYtelser]);

    return (
        <DataViewer response={{ ytelser }}>
            {({ ytelser }) => (
                <>
                    <Heading size={'small'} spacing>
                        {formaterYtelsesHeader(ytelser)}
                    </Heading>
                    {ytelser.kildeResultat
                        .filter((kildeResultat) => kildeResultat.resultat === 'FEILET')
                        .map((kildeResultat) => (
                            <Alert
                                key={kildeResultat.type}
                                variant={'warning'}
                                size={'small'}
                                style={{ maxWidth: 'fit-content' }}
                            >
                                Feilet ved henting av informasjon fra{' '}
                                {registerYtelseTilTekst[kildeResultat.type]}
                            </Alert>
                        ))}
                    <YtelserTabell perioder={ytelser.perioder} />
                    <Detail>Oppdatert: {formaterDatoMedTidspunkt(oppdatertTidspunkt)}</Detail>
                </>
            )}
        </DataViewer>
    );
};

export default Ytelseoversikt;
