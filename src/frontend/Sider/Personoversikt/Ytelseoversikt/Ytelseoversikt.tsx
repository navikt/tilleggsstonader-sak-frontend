import React, { useCallback, useEffect, useState } from 'react';

import { Alert, BodyShort, Detail, Heading } from '@navikt/ds-react';

import YtelserTabell from './YtelserTabell';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Registerytelser, registerYtelseTilTekst } from '../../../typer/registerytelser';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterDatoMedTidspunkt, formaterIsoPeriode } from '../../../utils/dato';

const formaterYtelserHentet = (ytelser: Registerytelser) => {
    const infotyper = ytelser.kildeResultat.map((info) => registerYtelseTilTekst[info.type]);
    const sisteType = infotyper.pop();
    return `Hentet perioder for følgende ytelser: ${infotyper.join(', ')} og ${sisteType}`;
};

const Ytelseoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [ytelser, settYtelser] = useState<Ressurs<Registerytelser>>(byggTomRessurs());

    const [oppdatertTidspunkt, settOppdatertTidspunkt] = useState<Date | undefined>();

    const hentYtelser = useCallback(async () => {
        settYtelser(byggHenterRessurs());
        const response = request<Registerytelser, null>(`/api/sak/ytelse/${fagsakPersonId}`, 'GET');
        settYtelser(await response);
    }, [fagsakPersonId, request]);

    useEffect(() => {
        hentYtelser().then(() => settOppdatertTidspunkt(new Date()));
    }, [fagsakPersonId, hentYtelser]);

    return (
        <DataViewer type={'andre ytelser'} response={{ ytelser }}>
            {({ ytelser }) => (
                <>
                    <Heading size={'small'}>
                        Andre ytelser i perioden{' '}
                        {formaterIsoPeriode(ytelser.perioderHentetFom, ytelser.perioderHentetTom)}
                    </Heading>
                    <BodyShort size={'small'} spacing>
                        {formaterYtelserHentet(ytelser)}
                    </BodyShort>
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
