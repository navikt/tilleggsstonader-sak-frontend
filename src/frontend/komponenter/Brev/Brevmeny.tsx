import React, { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

import Delmal from './Delmal';
import { lagHtmlStringAvBrev } from './Html';
import { MellomlagretBrevDto, parseMellomlagretBrev } from './mellomlagring';
import { lagVerdier } from './stønadsverdier/lagVerdier';
import { Fritekst, FritekstAvsnitt, MalStruktur, Tekst, Valg, Valgfelt } from './typer';
import { lagVedtakstabell } from './vedtakstabell/lagVedtakstabell';
import { useApp } from '../../context/AppContext';
import { useBrevFeilContext } from '../../context/ManglendeBrevVariablerContext';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { Behandling } from '../../typer/behandling/behandling';
import { Ressurs } from '../../typer/ressurs';
import { VedtakResponse } from '../../typer/vedtak/vedtak';

type Props = {
    mal: MalStruktur;
    mellomlagretBrev: MellomlagretBrevDto | undefined;
    settFil: React.Dispatch<React.SetStateAction<Ressurs<string>>>;
} & (
    | { behandling: Behandling; vedtak?: VedtakResponse; fagsakId?: never }
    | { behandling?: never; vedtak?: never; fagsakId: string }
);

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

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Brevmeny: React.FC<Props> = ({
    mal,
    behandling,
    mellomlagretBrev,
    fagsakId,
    settFil,
    vedtak,
}) => {
    const behandlingId = behandling?.id;
    const { personopplysninger } = usePersonopplysninger();
    const { oppdaterManglendeBrevVariabler } = useBrevFeilContext();
    const {
        mellomlagredeInkluderteDelmaler,
        mellomlagredeFritekstfelt,
        mellomlagredeValgfelt,
        mellomlagredeVariabler,
    } = useMemo(() => parseMellomlagretBrev(mellomlagretBrev), [mellomlagretBrev]);

    const [valgfelt, settValgfelt] = useState<
        Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    >(mellomlagredeValgfelt || {});

    const { variabelStore } = lagVerdier(behandling, vedtak);
    const [variabler, settVariabler] = useState<Partial<Record<string, string>>>(() => {
        return { ...mellomlagredeVariabler, ...variabelStore };
    });

    const initialiserInkluderteDelmaler = useCallback(
        () =>
            mal.delmaler.reduce((acc, current) => {
                const delmalErMedIMellomlager = !!(
                    mellomlagredeInkluderteDelmaler && mellomlagredeInkluderteDelmaler[current._id]
                );
                return {
                    ...acc,
                    [current._id]:
                        current.visningsdetaljer.skalAlltidMed || delmalErMedIMellomlager,
                };
            }, {}),
        [mal, mellomlagredeInkluderteDelmaler]
    );

    const [inkluderteDelmaler, settInkluderteDelmaler] = useState<Record<string, boolean>>(
        initialiserInkluderteDelmaler()
    );

    useEffect(() => {
        settInkluderteDelmaler(initialiserInkluderteDelmaler());
    }, [initialiserInkluderteDelmaler, mal]);

    const [fritekst, settFritekst] = useState<
        Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>
    >(mellomlagredeFritekstfelt || {});

    const { request } = useApp();

    const mellomlagreBrevmenyState = (
        malId: string,
        inkluderteDelmaler: Record<string, boolean>,
        fritekst: Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>,
        valgfelt: Partial<Record<string, Record<string, Fritekst | Tekst>>>,
        variabler: Partial<Record<string, string>>
    ) => {
        const mellomlagerUrl = behandlingId
            ? `/api/sak/brev/mellomlager/${behandling?.id}`
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
                navn: personopplysninger.navn.visningsnavn,
                personIdent: personopplysninger.personIdent,
                fritekst: fritekst,
                inkluderteDelmaler: inkluderteDelmaler,
                mal: mal,
                valgfelt: valgfelt,
                variabler: variabler,
                htmlVariabler: lagVedtakstabell(behandling, vedtak),
                inkluderBeslutterSignaturPlaceholder: !!behandlingId,
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

    useEffect(() => {
        oppdaterManglendeBrevVariabler(mal, inkluderteDelmaler, valgfelt, variabler);
        // eslint-disable-next-line
    }, [inkluderteDelmaler, variabler]);
    return (
        <FlexColumn>
            {mal.delmaler.map(
                (delmal) =>
                    delmal.visningsdetaljer.skalVisesIBrevmeny && (
                        <Delmal
                            delmal={delmal}
                            key={delmal._id}
                            valgfelt={valgfelt[delmal._id] || {}}
                            settValgfelt={oppdaterStateForId(delmal._id, valgfelt, settValgfelt)}
                            variabler={variabler || {}}
                            settVariabler={settVariabler}
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
                    )
            )}
        </FlexColumn>
    );
};

export default Brevmeny;
