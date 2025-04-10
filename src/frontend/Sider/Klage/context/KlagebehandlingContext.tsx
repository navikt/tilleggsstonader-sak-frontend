import { useEffect, useState } from 'react';

import constate from 'constate';
import { useParams } from 'react-router-dom';

import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import { RessursStatus } from '../../../typer/ressurs';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { useHentFormkravVilkår } from '../hooks/useHentFormkravVilkår';
import { useHentKlagebehandling } from '../hooks/useHentKlagebehandling';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Steg/Formkrav/validerFormkravUtils';
import { erBehandlingRedigerbar } from '../typer/klagebehandling/klagebehandling';

const [KlagebehandlingProvider, useKlagebehandling] = constate(() => {
    const behandlingId = useParams<{ behandlingId: string }>().behandlingId as string;

    const { hentPersonopplysninger, personopplysningerFraKlageResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentKlagebehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
    const [formkravOppfylt, settFormkravOppfylt] = useState<boolean>(false);
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);

    useEffect(() => {
        hentVilkårsvurderinger(behandlingId);
    }, [behandling, behandlingId, hentVilkårsvurderinger]);
    useEffect(() => {
        settFormkravOppfylt(
            vilkårsvurderinger.status === RessursStatus.SUKSESS &&
                påKlagetVedtakValgt(vilkårsvurderinger.data) &&
                alleVilkårOppfylt(vilkårsvurderinger.data)
        );
    }, [vilkårsvurderinger]);

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);
    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);

    const [vurderingEndret, settVurderingEndret] = useState(false);

    const behandlingErRedigerbar =
        behandling.status === RessursStatus.SUKSESS && erBehandlingRedigerbar(behandling.data);

    return {
        behandling,
        behandlingErRedigerbar,
        personopplysningerFraKlageResponse,
        behandlingHistorikk,
        hentBehandling,
        hentBehandlingshistorikk,
        visBrevmottakereModal,
        settVisBrevmottakereModal,
        visHenleggModal,
        settVisHenleggModal,
        åpenHøyremeny,
        settÅpenHøyremeny,
        vurderingEndret,
        settVurderingEndret,
        formkravOppfylt,
        statusPåVentRedigering,
        settStatusPåVentRedigering,
    };
});

export { KlagebehandlingProvider, useKlagebehandling };
