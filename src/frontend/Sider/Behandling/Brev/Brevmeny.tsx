import React, { SetStateAction, useEffect, useState } from 'react';

import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

import Delmal from './Delmal';
import { lagHtmlStringAvBrev } from './Html';
import { FritekstAvsnitt, MalStruktur, Valg, Valgfelt } from './typer';
import { useApp } from '../../../context/AppContext';
import PdfVisning from '../../../komponenter/PdfVisning';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

interface Props {
    mal: MalStruktur;
    behandlingId: string;
}

const lagReducer =
    <T,>(
        id: string,
        state: Partial<Record<string, Record<string, T>>>,
        settState: React.Dispatch<SetStateAction<Partial<Record<string, Record<string, T>>>>>
    ) =>
    (utledNesteState: React.SetStateAction<Record<string, T>>) => {
        const prevState = state[id] || {};
        const nextState =
            typeof utledNesteState === 'function' ? utledNesteState(prevState) : utledNesteState;

        settState((prevState) => ({
            ...prevState,
            [id]: nextState,
        }));
    };

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-start;
`;

const Brevmeny: React.FC<Props> = ({ mal, behandlingId }) => {
    const [valgfelt, settValgfelt] = useState<
        Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    >({});
    const [variabler, settVariabler] = useState<Partial<Record<string, Record<string, string>>>>(
        {}
    );

    const [inkluderteDelmaler, settInkluderteDelmaler] = useState<Record<string, boolean>>(
        mal.delmaler.reduce(
            (acc, current) => ({
                ...acc,
                [current._id]: current.visningsdetaljer.skalAlltidMed,
            }),
            {}
        )
    );

    const [fritekst, settFritekst] = useState<
        Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>
    >({});

    const [fil, settFil] = useState<Ressurs<string>>(byggTomRessurs());

    const { request } = useApp();

    const genererPdf = () => {
        request<string, { html: string }>(`/api/sak/brev/${behandlingId}`, 'POST', {
            html: lagHtmlStringAvBrev({
                // TODO: Bytt ut hardkodet data
                brevOpprettetDato: '16.10.2023',
                navn: 'Bjarne',
                personIdent: '12345678',
                fritekst: fritekst,
                inkluderteDelmaler: inkluderteDelmaler,
                mal: mal,
                valgfelt: valgfelt,
                variabler: variabler,
            }),
        }).then(settFil);
    };

    const utsattGenererBrev = useDebouncedCallback(genererPdf, 1000);

    useEffect(utsattGenererBrev, [
        utsattGenererBrev,
        mal,
        variabler,
        valgfelt,
        fritekst,
        inkluderteDelmaler,
    ]);

    return (
        <Container>
            <FlexColumn>
                {mal.delmaler.map((delmal) => (
                    <Delmal
                        delmal={delmal}
                        key={delmal._id}
                        valgfelt={valgfelt[delmal._id] || {}}
                        settValgfelt={lagReducer(delmal._id, valgfelt, settValgfelt)}
                        variabler={variabler[delmal._id] || {}}
                        settVariabler={lagReducer(delmal._id, variabler, settVariabler)}
                        fritekst={fritekst[delmal._id] || {}}
                        settFritekst={lagReducer(delmal._id, fritekst, settFritekst)}
                        inkluderIBrev={inkluderteDelmaler[delmal._id]}
                        settInkluderIBrev={(inkluderIBrev) => {
                            settInkluderteDelmaler((prevState) => ({
                                ...prevState,
                                [delmal._id]: inkluderIBrev,
                            }));
                        }}
                    />
                ))}
            </FlexColumn>
            <PdfVisning pdfFilInnhold={fil} />
        </Container>
    );
};

export default Brevmeny;
