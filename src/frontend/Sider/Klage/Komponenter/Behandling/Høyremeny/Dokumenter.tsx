import * as React from 'react';
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../../../App/typer/routing';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
// import { Dokumentliste, DokumentProps } from '@navikt/familie-dokumentliste';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { compareDesc } from 'date-fns';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { Heading } from '@navikt/ds-react';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import styled from 'styled-components';

const OverSkrift = styled(Heading)`
    margin-top: 0.5rem;
    margin-left: 1rem;
`;
const Dokumenter: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const { behandlingId } = useParams<IBehandlingParams>();

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-klage/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );
    // const dokumentResponse = useDataHenter<DokumentProps[], null>(dokumentConfig);
    //
    // const sorterDokumentlisten = (dokumenter: DokumentProps[]) => {
    //     return dokumenter
    //         .sort((a, b) => {
    //             if (!a.dato) {
    //                 return 1;
    //             } else if (!b.dato) {
    //                 return -1;
    //             }
    //             return compareDesc(new Date(a.dato), new Date(b.dato));
    //         })
    //         .map((dokument) => {
    //             return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
    //         });
    // };
    //
    // const lastNedDokument = (dokument: DokumentProps) => {
    //     åpneFilIEgenTab(
    //         dokument.journalpostId,
    //         dokument.dokumentinfoId,
    //         dokument.tittel || dokument.filnavn || ''
    //     );
    // };

    if (hidden) {
        return <></>;
    }

    return (<></>
        // <DataViewer response={{ dokumentResponse }}>
        //     {({ dokumentResponse }) => {
        //         const sortertDokumentliste = sorterDokumentlisten(dokumentResponse);
        //         return (
        //             <>
        //                 <OverSkrift size={'small'}>Dokumentoversikt</OverSkrift>
        //                 <Dokumentliste
        //                     dokumenter={sortertDokumentliste}
        //                     onClick={lastNedDokument}
        //                 />
        //             </>
        //         );
        //     }}
        // </DataViewer>
    );
};

export default Dokumenter;
