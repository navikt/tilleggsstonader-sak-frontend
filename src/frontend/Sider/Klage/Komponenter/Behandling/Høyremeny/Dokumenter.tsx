import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { useParams } from 'react-router-dom';
import { useDataHenter } from '../../../App/hooks/useDataHenter';
import DataViewer from '../../../../../komponenter/DataViewer';
import { compareDesc } from 'date-fns';
import { Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import {
    Dokumentliste,
    DokumentProps,
} from '../../../familie-felles-frontend/familie-dokumentliste';
import { åpneFilIEgenTab } from '../../../../../utils/utils';
import { formaterNullableIsoDatoTid } from '../../../../../utils/dato';

const OverSkrift = styled(Heading)`
    margin-top: 0.5rem;
    margin-left: 1rem;
`;
const Dokumenter: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const { behandlingId } = useParams<{ behandlingId: string }>();

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/api/klage/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );
    const dokumentResponse = useDataHenter<DokumentProps[], null>(dokumentConfig);

    const sorterDokumentlisten = (dokumenter: DokumentProps[]) => {
        return dokumenter
            .sort((a, b) => {
                if (!a.dato) {
                    return 1;
                } else if (!b.dato) {
                    return -1;
                }
                return compareDesc(new Date(a.dato), new Date(b.dato));
            })
            .map((dokument) => {
                return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
            });
    };

    const lastNedDokument = (dokument: DokumentProps) => {
        åpneFilIEgenTab(
            dokument.journalpostId,
            dokument.dokumentinfoId,
            dokument.tittel || dokument.filnavn || ''
        );
    };

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const sortertDokumentliste = sorterDokumentlisten(dokumentResponse);
                return (
                    <>
                        <OverSkrift size={'small'}>Dokumentoversikt</OverSkrift>
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
