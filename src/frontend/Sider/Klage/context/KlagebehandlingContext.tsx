import constate from 'constate';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useHentKlagebehandling } from '../hooks/useHentKlagebehandling';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { useHentFormkravVilkår } from '../hooks/useHentFormkravVilkår';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Steg/Formkrav/validerFormkravUtils';
import { erBehandlingRedigerbar } from '../typer/klagebehandling/klagebehandling';
import { RessursStatus } from '../../../typer/ressurs';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';

const [KlagebehandlingProvider, useKlagebehandling] = constate(() => {
    const behandlingId = useParams<{ behandlingId: string }>().behandlingId as string;

    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerFraKlageResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentKlagebehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
    const [formkravOppfylt, settFormkravOppfylt] = useState<boolean>(false);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);

    useEffect(() => {
        settBehandlingErRedigerbar(
            behandling.status === RessursStatus.SUKSESS && erBehandlingRedigerbar(behandling.data)
        );
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
    };
});

export { KlagebehandlingProvider, useKlagebehandling };
