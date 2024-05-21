import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import FrittståendeBrev from './FrittståendeBrev';
import { useHentFagsakPerson } from '../../../hooks/useFagsakPerson';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { utledFagsakId } from '../../../typer/fagsak';

const Container = styled.div`
    display: flex;
    gap: 2rem;
    flex-direction: column;
`;

const FrittståendeBrevFane: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { fagsakPerson, hentFagsakPerson } = useHentFagsakPerson();

    const [valgtStønadstype, settValgtStønadstype] = useState<Stønadstype>();

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
                            onChange={(e) => settValgtStønadstype(e.target.value as Stønadstype)}
                            value={valgtStønadstype}
                            size="small"
                            style={{ maxWidth: 'fit-content' }}
                        >
                            <option value={''}>Velg</option>
                            {fagsakPerson.tilsynBarn && (
                                <option
                                    value={Stønadstype.BARNETILSYN}
                                    key={fagsakPerson.tilsynBarn}
                                >
                                    {Stønadstype.BARNETILSYN}
                                </option>
                            )}
                        </Select>
                        {valgtStønadstype && (
                            <FrittståendeBrev
                                valgtStønadstype={valgtStønadstype}
                                fagsakId={utledFagsakId(valgtStønadstype, fagsakPerson)}
                            />
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default FrittståendeBrevFane;
