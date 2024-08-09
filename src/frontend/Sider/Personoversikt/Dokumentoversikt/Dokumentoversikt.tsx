import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { UNSAFE_Combobox } from '@navikt/ds-react';

import { DokumentTabell } from './DokumentTabell';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Arkivtema, arkivtemaerTilTekst, relevanteArkivtemaer } from '../../../typer/arkivtema';
import { DokumentInfo, VedleggRequest } from '../../../typer/dokument';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';

const ComboBox = styled(UNSAFE_Combobox)`
    width: 35rem;
`;

const Dokumentoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());

    const [vedleggRequest, settVedleggRequest] = useState<VedleggRequest>({
        tema: [Arkivtema.TSO, Arkivtema.TSR],
    });

    const hentDokumenter = useCallback(
        (fagsakPersonId: string) => {
            settDokumenter(byggHenterRessurs());
            request<DokumentInfo[], VedleggRequest>(
                `/api/sak/vedlegg/fagsak-person/${fagsakPersonId}`,
                'POST',
                {
                    ...vedleggRequest,
                    tema:
                        vedleggRequest.tema.length > 0 ? vedleggRequest.tema : relevanteArkivtemaer,
                }
            ).then(settDokumenter);
        },
        [request, vedleggRequest]
    );

    useEffect(() => {
        hentDokumenter(fagsakPersonId);
    }, [fagsakPersonId, hentDokumenter]);

    const arkivtemaTilOption = (t: Arkivtema) => ({
        value: t,
        label: arkivtemaerTilTekst[t],
    });
    const onToggleSelected = (option: string, isSelected: boolean) =>
        settVedleggRequest((prevState) => ({
            ...prevState,
            tema: isSelected
                ? [...(prevState.tema ?? []), option as Arkivtema]
                : (prevState.tema ?? []).filter((t) => t !== option),
        }));

    return (
        <>
            <ComboBox
                label={'Filtrer tema(er)'}
                options={relevanteArkivtemaer.map(arkivtemaTilOption)}
                isMultiSelect
                onToggleSelected={onToggleSelected}
                selectedOptions={vedleggRequest.tema?.map(arkivtemaTilOption) ?? []}
            />
            <DataViewer response={{ dokumenter }}>
                {({ dokumenter }) => <DokumentTabell dokumenter={dokumenter} />}
            </DataViewer>
        </>
    );
};

export default Dokumentoversikt;
