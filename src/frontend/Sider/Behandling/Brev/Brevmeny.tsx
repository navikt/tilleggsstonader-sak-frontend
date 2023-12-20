import React, { SetStateAction, useEffect, useState } from 'react';

import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@navikt/ds-react';

import Delmal from './Delmal';
import { lagHtmlStringAvBrev } from './Html';
import { Fritekst, FritekstAvsnitt, MalStruktur, Tekst, Valg, Valgfelt } from './typer';
import { MellomlagretBrevDto, parseMellomlagretBrev } from './useMellomlagrignBrev';
import { useApp } from '../../../context/AppContext';
import PdfVisning from '../../../komponenter/PdfVisning';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';

type Props = {
    mal: MalStruktur;
    mellomlagretBrev: MellomlagretBrevDto | undefined;
} & ({ behandlingId: string; fagsakId?: never } | { fagsakId: string; behandlingId?: never });

const oppdaterStateForId =
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

const Brevmeny: React.FC<Props> = ({ mal, behandlingId, mellomlagretBrev, fagsakId }) => {
    const { initInkluderterDelmaler, initFritekst, initValgfelt, initVariabler } =
        parseMellomlagretBrev(mellomlagretBrev);

    const [valgfelt, settValgfelt] = useState<
        Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    >(initValgfelt || {});
    const [variabler, settVariabler] = useState<Partial<Record<string, Record<string, string>>>>(
        initVariabler || {}
    );

    const [inkluderteDelmaler, settInkluderteDelmaler] = useState<Record<string, boolean>>(
        mal.delmaler.reduce((acc, current) => {
            const delmalErMedIMellomlager = !!(
                initInkluderterDelmaler && initInkluderterDelmaler[current._id]
            );
            return {
                ...acc,
                [current._id]: current.visningsdetaljer.skalAlltidMed || delmalErMedIMellomlager,
            };
        }, {})
    );

    const [fritekst, settFritekst] = useState<
        Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>
    >(initFritekst || {});

    const [fil, settFil] = useState<Ressurs<string>>(byggTomRessurs());

    const { request } = useApp();

    const mellomlagreBrevmenyState = (
        malId: string,
        inkluderteDelmaler: Record<string, boolean>,
        fritekst: Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>,
        valgfelt: Partial<Record<string, Record<string, Fritekst | Tekst>>>,
        variabler: Partial<Record<string, Record<string, string>>>
    ) => {
        const mellomlagerUrl = behandlingId
            ? `/api/sak/brev/mellomlager/${behandlingId}`
            : `/api/sak/brev/mellomlager/fagsak/${fagsakId}`;

        const data: MellomlagretBrevDto = {
            brevmal: malId,
            brevverdier: JSON.stringify({
                inkluderteDelmaler,
                fritekst,
                valgfelt,
                variabler,
            }),
        };

        request<null, MellomlagretBrevDto>(mellomlagerUrl, 'POST', data);
    };

    const genererPdf = () => {
        const url = behandlingId ? `/api/sak/brev/${behandlingId}` : `/api/sak/frittstaende-brev`;

        mellomlagreBrevmenyState(mal._id, inkluderteDelmaler, fritekst, valgfelt, variabler);

        request<string, { html: string }>(url, 'POST', {
            html: lagHtmlStringAvBrev({
                navn: 'Bjarne',
                personIdent: '12345678',
                fritekst: fritekst,
                inkluderteDelmaler: inkluderteDelmaler,
                mal: mal,
                valgfelt: valgfelt,
                variabler: variabler,
                inkluderBeslutterSignaturPlaceholder: !!behandlingId,
            }),
        }).then(settFil);
    };

    const utsattGenererBrev = useDebouncedCallback(genererPdf, 1000);

    const sendBrev = () => {
        if (fil.status === RessursStatus.SUKSESS && fagsakId) {
            request<null, { pdf: string; tittel: string }>(
                `/api/sak/frittstaende-brev/send/${fagsakId}`,
                'POST',
                {
                    pdf: fil.data,
                    tittel: mal.brevtittel,
                }
            ).then((res) => {
                // eslint-disable-next-line no-console
                console.log(res);
            });
        }
    };

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
                        settValgfelt={oppdaterStateForId(delmal._id, valgfelt, settValgfelt)}
                        variabler={variabler[delmal._id] || {}}
                        settVariabler={oppdaterStateForId(delmal._id, variabler, settVariabler)}
                        fritekst={fritekst[delmal._id] || {}}
                        settFritekst={oppdaterStateForId(delmal._id, fritekst, settFritekst)}
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
            <Button onClick={sendBrev}>Send brev</Button>
        </Container>
    );
};

export default Brevmeny;
