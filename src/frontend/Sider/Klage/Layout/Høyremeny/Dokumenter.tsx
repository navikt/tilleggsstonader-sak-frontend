import * as React from 'react';
import { useHentDokumenter } from '../../hooks/useHentDokumenter';
import DataViewer from '../../../../komponenter/DataViewer';
import { Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dokumentliste } from '../../familie-felles-frontend/familie-dokumentliste';
import { lastNedDokument, sorterDokumentlisten } from './utils';

const Overskrift = styled(Heading)`
    margin-top: 0.5rem;
    margin-left: 1rem;
`;

const Dokumenter: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const dokumentResponse = useHentDokumenter();

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse: dokumenter }) => {
                const sortertDokumentliste = sorterDokumentlisten(dokumenter);
                return (
                    <>
                        <Overskrift size={'small'}>Dokumentoversikt</Overskrift>
                        <Dokumentliste
                            dokumenter={sortertDokumentliste}
                            onClick={lastNedDokument}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Dokumenter;
