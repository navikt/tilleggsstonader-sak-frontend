import React, { useEffect, useState } from 'react';

import { Alert, Heading, Select } from '@navikt/ds-react';

import FrittståendeBrev from './FrittståendeBrev';
import styles from './FrittståendeBrevFane.module.css';
import { BrevFeilContextProvider } from '../../../context/BrevFeilContext';
import { useHentFagsakPerson } from '../../../hooks/useFagsakPerson';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { utledFagsakId, utledFagsakIdEllerKastFeil } from '../../../typer/fagsak';

const FrittståendeBrevFane: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { fagsakPerson, hentFagsakPerson } = useHentFagsakPerson();

    const [valgtStønadstype, settValgtStønadstype] = useState<Stønadstype>();
    const [brevErSendt, settBrevErSendt] = useState<boolean>(false);

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson]);

    return (
        <div className={styles.container}>
            <Heading size="small">Frittstående brev til bruker</Heading>
            <DataViewer type={'fagsak'} response={{ fagsakPerson }}>
                {({ fagsakPerson }) => (
                    <>
                        <Select
                            label="Velg stønadstype"
                            onChange={(e) => {
                                settValgtStønadstype(e.target.value as Stønadstype);
                                settBrevErSendt(false);
                            }}
                            value={valgtStønadstype || ''}
                            size="small"
                            style={{ maxWidth: 'fit-content' }}
                        >
                            <option value={''}>Velg</option>
                            {Object.keys(Stønadstype).map((key) => {
                                const stønadstype = key as Stønadstype;
                                const fagsakId = utledFagsakId(stønadstype, fagsakPerson);
                                return (
                                    fagsakId && (
                                        <option value={stønadstype} key={fagsakId}>
                                            {stønadstypeTilTekst[stønadstype]}
                                        </option>
                                    )
                                );
                            })}
                        </Select>
                        <BrevFeilContextProvider>
                            {valgtStønadstype && (
                                <FrittståendeBrev
                                    valgtStønadstype={valgtStønadstype}
                                    fagsakId={utledFagsakIdEllerKastFeil(
                                        valgtStønadstype,
                                        fagsakPerson
                                    )}
                                    settBrevErSendt={() => {
                                        settValgtStønadstype(undefined);
                                        settBrevErSendt(true);
                                    }}
                                />
                            )}
                        </BrevFeilContextProvider>
                        {brevErSendt && (
                            <Alert variant={'info'} style={{ maxWidth: 'fit-content' }}>
                                Brevet er nå sendt
                            </Alert>
                        )}
                    </>
                )}
            </DataViewer>
        </div>
    );
};

export default FrittståendeBrevFane;
