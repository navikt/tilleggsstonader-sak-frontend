import { useEffect, useState } from 'react';

import constate from 'constate';

const [KlageAppProvider, useKlageApp] = constate(() => {
    const [ikkePersisterteKomponenter, settIkkePersisterteKomponenter] = useState<Set<string>>(
        new Set()
    );
    const [ulagretData, settUlagretData] = useState<boolean>(ikkePersisterteKomponenter.size > 0);
    const [valgtSide, settValgtSide] = useState<string | undefined>();
    const [visUlagretDataModal, settVisUlagretDataModal] = useState(false);
    const [byttUrl, settByttUrl] = useState(false);
    const [valgtFagsakId, settValgtFagsakId] = useState<string>();
    const [personIdent, settPersonIdent] = useState<string>();

    useEffect(
        () => settUlagretData(ikkePersisterteKomponenter.size > 0),
        [ikkePersisterteKomponenter]
    );

    const settIkkePersistertKomponent = (komponentId: string) => {
        if (ikkePersisterteKomponenter.has(komponentId)) return;

        settIkkePersisterteKomponenter(new Set(ikkePersisterteKomponenter).add(komponentId));
    };

    const nullstillIkkePersistertKomponent = (komponentId: string) => {
        const kopi = new Set(ikkePersisterteKomponenter);
        kopi.delete(komponentId);
        settIkkePersisterteKomponenter(kopi);
    };

    const nullstillIkkePersisterteKomponenter = () => {
        settIkkePersisterteKomponenter(new Set());
    };

    const gåTilUrl = (url: string) => {
        if (ulagretData) {
            settValgtSide(url);
            settVisUlagretDataModal(true);
        } else {
            settValgtSide(url);
            settByttUrl(true);
        }
    };

    return {
        settIkkePersistertKomponent,
        nullstillIkkePersistertKomponent,
        nullstillIkkePersisterteKomponenter,
        gåTilUrl,
        valgtSide,
        visUlagretDataModal,
        settVisUlagretDataModal,
        byttUrl,
        settByttUrl,
        valgtFagsakId,
        settValgtFagsakId,
        personIdent,
        settPersonIdent,
    };
});

export { KlageAppProvider, useKlageApp };
