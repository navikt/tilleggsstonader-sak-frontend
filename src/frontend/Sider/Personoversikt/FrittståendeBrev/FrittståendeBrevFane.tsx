import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { useHentFagsakPerson } from '../../../hooks/useFagsakPerson';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

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
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default FrittståendeBrevFane;
