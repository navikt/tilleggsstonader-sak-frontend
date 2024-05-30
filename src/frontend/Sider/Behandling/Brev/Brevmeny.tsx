import React, { SetStateAction, useEffect, useState } from 'react';

import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

import Delmal from './Delmal';
import { lagHtmlStringAvBrev } from './Html';
import { lagHtmlFelt } from './lagHtmlFelt';
import { Fritekst, FritekstAvsnitt, MalStruktur, Tekst, Valg, Valgfelt } from './typer';
import { MellomlagretBrevDto, parseMellomlagretBrev } from './useMellomlagrignBrev';
import { useApp } from '../../../context/AppContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import { Ressurs } from '../../../typer/ressurs';
import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak';

type Props = {
    mal: MalStruktur;
    mellomlagretBrev: MellomlagretBrevDto | undefined;
    settFil: React.Dispatch<React.SetStateAction<Ressurs<string>>>;
    beregningsresultat?: BeregningsresultatTilsynBarn;
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

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Brevmeny: React.FC<Props> = ({
    mal,
    behandlingId,
    mellomlagretBrev,
    fagsakId,
    settFil,
    beregningsresultat,
}) => {
    const { personopplysninger } = usePersonopplysninger();
    const {
        mellomlagredeInkluderteDelmaler,
        mellomlagredeFritekstfelt,
        mellomlagredeValgfelt,
        mellomlagredeVariabler,
    } = parseMellomlagretBrev(mellomlagretBrev);

    const [valgfelt, settValgfelt] = useState<
        Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    >(mellomlagredeValgfelt || {});

    const [variabler, settVariabler] = useState<Partial<Record<string, string>>>(() => {
        return { ...mellomlagredeVariabler };
    });

    const [inkluderteDelmaler, settInkluderteDelmaler] = useState<Record<string, boolean>>(
        mal.delmaler.reduce((acc, current) => {
            const delmalErMedIMellomlager = !!(
                mellomlagredeInkluderteDelmaler && mellomlagredeInkluderteDelmaler[current._id]
            );
            return {
                ...acc,
                [current._id]: current.visningsdetaljer.skalAlltidMed || delmalErMedIMellomlager,
            };
        }, {})
    );

    const [fritekst, settFritekst] = useState<
        Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>
    >(mellomlagredeFritekstfelt || {});

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
                navn: personopplysninger.navn.visningsnavn,
                personIdent: personopplysninger.personIdent,
                fritekst: fritekst,
                inkluderteDelmaler: inkluderteDelmaler,
                mal: mal,
                valgfelt: valgfelt,
                variabler: variabler,
                htmlVariabler: lagHtmlFelt(beregningsresultat),
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
                    )
            )}
        </FlexColumn>
    );
};

export default Brevmeny;
