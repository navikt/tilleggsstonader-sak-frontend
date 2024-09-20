import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Alert, Select } from '@navikt/ds-react';

import FrittståendeBrev from './FrittståendeBrev';
import { useHentFagsakPerson } from '../../../hooks/useFagsakPerson';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { utledFagsakId } from '../../../typer/fagsak';

const Container = styled.div`
    display: flex;
    gap: 2rem;
    flex-direction: column;
`;

const FrittståendeBrevFane: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { fagsakPerson, hentFagsakPerson } = useHentFagsakPerson();

    const [valgtStønadstype, settValgtStønadstype] = useState<Stønadstype>();
    const [brevErSendt, settBrevErSendt] = useState<boolean>(false);

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson]);

    return (
        <Container>
            <DataViewer response={{ fagsakPerson }}>
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
                            {fagsakPerson.tilsynBarn && (
                                <option
                                    value={Stønadstype.BARNETILSYN}
                                    key={fagsakPerson.tilsynBarn}
                                >
                                    {stønadstypeTilTekst[Stønadstype.BARNETILSYN]}
                                </option>
                            )}
                        </Select>
                        {valgtStønadstype && (
                            <FrittståendeBrev
                                valgtStønadstype={valgtStønadstype}
                                fagsakId={utledFagsakId(valgtStønadstype, fagsakPerson)}
                                settBrevErSendt={() => {
                                    settValgtStønadstype(undefined);
                                    settBrevErSendt(true);
                                }}
                            />
                        )}
                        {brevErSendt && (
                            <Alert variant={'info'} style={{ maxWidth: 'fit-content' }}>
                                Brevet er nå sendt
                            </Alert>
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default FrittståendeBrevFane;
