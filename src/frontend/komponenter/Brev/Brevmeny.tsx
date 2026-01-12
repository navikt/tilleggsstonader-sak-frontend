import React, { useEffect, useMemo, useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';

import { Brevknapp } from './Brevknapp';
import styles from './Brevmeny.module.css';
import { Delmal } from './Delmal';
import { lagHtmlStringAvBrev } from './Html';
import { MellomlagretBrevDto, parseMellomlagretBrev } from './mellomlagring';
import { lagInnvilgetPerioderPunktliste } from './punktliste/lagInnvilgetPerioderPunktliste';
import { lagVerdier } from './stønadsverdier/lagVerdier';
import { Fritekst, FritekstAvsnitt, MalStruktur, Tekst, Valg, Valgfelt } from './typer';
import {
    variabelBeregningstabellId,
    variabelInnvilgedePerioderPunktlisteId,
} from './variablerUtils';
import { lagVedtakstabell } from './vedtakstabell/lagVedtakstabell';
import { useApp } from '../../context/AppContext';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { Behandling } from '../../typer/behandling/behandling';
import { Ressurs } from '../../typer/ressurs';
import { VedtakResponse } from '../../typer/vedtak/vedtak';

type Props = {
    mal: MalStruktur;
    mellomlagretBrev: MellomlagretBrevDto | undefined;
    settFil: React.Dispatch<React.SetStateAction<Ressurs<string>>>;
    brevknapp: {
        tittel: string;
        onClick: (kommentarTilBeslutter: string | undefined) => Promise<void>;
        visKnapp: boolean;
        kanSendeKommentarTilBeslutter?: boolean;
    };
} & (
    | { behandling: Behandling; vedtak?: VedtakResponse; fagsakId?: never }
    | { behandling?: never; vedtak?: never; fagsakId: string }
);

export function oppdaterStateForId<T>(
    id: string,
    state: Partial<Record<string, Record<string, T>>>,
    settState: React.Dispatch<React.SetStateAction<Partial<Record<string, Record<string, T>>>>>
) {
    return function (utledNesteState: React.SetStateAction<Record<string, T>>) {
        const prevState = state[id] || {};
        const nextState =
            typeof utledNesteState === 'function' ? utledNesteState(prevState) : utledNesteState;

        settState((prevState) => ({
            ...prevState,
            [id]: nextState,
        }));
    };
}

export function initialiserInkluderteDelmaler(
    mal: MalStruktur,
    mellomlagredeInkluderteDelmaler: Record<string, boolean> | undefined
) {
    return mal.delmaler.reduce<Record<string, boolean>>((acc, current) => {
        const delmalErMedIMellomlager = !!(
            mellomlagredeInkluderteDelmaler && mellomlagredeInkluderteDelmaler[current._id]
        );

        return {
            ...acc,
            [current._id]: current.visningsdetaljer.skalAlltidMed || delmalErMedIMellomlager,
        };
    }, {});
}

export const Brevmeny: React.FC<Props> = ({
    mal,
    behandling,
    mellomlagretBrev,
    fagsakId,
    settFil,
    vedtak,
    brevknapp,
}) => {
    const behandlingId = behandling?.id;
    const { personopplysninger } = usePersonopplysninger();
    const {
        mellomlagredeInkluderteDelmaler,
        mellomlagredeFritekstfelt,
        mellomlagredeValgfelt,
        mellomlagredeVariabler,
    } = useMemo(() => parseMellomlagretBrev(mellomlagretBrev), [mellomlagretBrev]);

    const [valgfelt, settValgfelt] = useState<
        Partial<Record<string, Record<Valgfelt['_id'], Valg>>>
    >(mellomlagredeValgfelt || {});
    const [generererBrevPdf, settGenerererBrevPdf] = useState(false);

    const { variabelStore } = lagVerdier(behandling, vedtak);
    const [variabler, settVariabler] = useState<Partial<Record<string, string>>>(() => {
        return { ...mellomlagredeVariabler, ...variabelStore };
    });

    const [inkluderteDelmaler, settInkluderteDelmaler] = useState<Record<string, boolean>>(
        initialiserInkluderteDelmaler(mal, mellomlagredeInkluderteDelmaler)
    );

    useEffect(() => {
        settInkluderteDelmaler(initialiserInkluderteDelmaler(mal, mellomlagredeInkluderteDelmaler));
    }, [mal, mellomlagredeInkluderteDelmaler]);

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

    function genererHtmlVariabler() {
        const htmlVariabler: Record<string, string> = {
            [variabelInnvilgedePerioderPunktlisteId]: lagInnvilgetPerioderPunktliste(
                behandling,
                vedtak
            ),
            [variabelBeregningstabellId]: lagVedtakstabell(behandling, vedtak),
        };
        return htmlVariabler;
    }

    function genererPdf() {
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
                htmlVariabler: genererHtmlVariabler(),
                inkluderBeslutterSignaturPlaceholder: !!behandlingId,
            }),
        })
            .then(settFil)
            .finally(() => {
                settGenerererBrevPdf(false);
            });
    }

    const utsattGenererBrev = useDebouncedCallback(genererPdf, 1000);

    useEffect(() => {
        settGenerererBrevPdf(true);
        utsattGenererBrev();
    }, [utsattGenererBrev, mal, variabler, valgfelt, fritekst, inkluderteDelmaler]);

    function erEndringerIDelmal(delmalId: string) {
        const valgfeltForDelmal = valgfelt[delmalId] || {};
        const fritekstForDelmal = fritekst[delmalId] || {};
        const erEndringerIValgfelt = Object.keys(valgfeltForDelmal).length > 0;
        const erEndringerIFritekst = Object.values(fritekstForDelmal)
            .flat()
            .filter((avsnitt) => avsnitt !== undefined)
            .some(({ deloverskrift, innhold }) => deloverskrift.length > 0 || innhold.length > 0);
        return erEndringerIValgfelt || erEndringerIFritekst;
    }

    return (
        <div className={styles.flexColumn}>
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
                            inkluderIBrev={inkluderteDelmaler[delmal._id] || false}
                            settInkluderIBrev={(inkluderIBrev) => {
                                settInkluderteDelmaler((prevState) => ({
                                    ...prevState,
                                    [delmal._id]: inkluderIBrev,
                                }));
                            }}
                            erEndringerIDelmal={erEndringerIDelmal(delmal._id)}
                        />
                    )
            )}
            {brevknapp.visKnapp && (
                <Brevknapp
                    tittel={brevknapp.tittel}
                    onClick={brevknapp.onClick}
                    mal={mal}
                    inkluderteDelmaler={inkluderteDelmaler}
                    valgfelt={valgfelt}
                    variabler={variabler}
                    generererBrevPdf={generererBrevPdf}
                    kanSendeKommentarTilBeslutter={brevknapp.kanSendeKommentarTilBeslutter}
                />
            )}
        </div>
    );
};
