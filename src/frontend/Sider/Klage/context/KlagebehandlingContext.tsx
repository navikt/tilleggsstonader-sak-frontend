import { useEffect, useState } from 'react';

import constate from 'constate';

import { RerrunnableEffect, useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import { RessursStatus } from '../../../typer/ressurs';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { useHentFormkravVilkår } from '../hooks/useHentFormkravVilkår';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Steg/Formkrav/validerFormkravUtils';
import { erBehandlingRedigerbar, Klagebehandling } from '../typer/klagebehandling/klagebehandling';
import { PersonopplysningerFraKlage } from '../typer/personopplysningerFraKlage';

const [KlagebehandlingProvider, useKlagebehandling] = constate(
    ({
        behandling,
        hentBehandling,
        personopplysninger,
    }: {
        behandling: Klagebehandling;
        hentBehandling: RerrunnableEffect;
        personopplysninger: PersonopplysningerFraKlage;
    }) => {
        const behandlingId = behandling.id;

        const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
            useHentBehandlingHistorikk(behandlingId);
        const { vilkårsvurderinger, hentVilkårsvurderinger } = useHentFormkravVilkår();
        const [formkravOppfylt, settFormkravOppfylt] = useState<boolean>(false);
        const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

        const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
            behandlingId,
        ]);

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

        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling);

        return {
            behandling,
            behandlingErRedigerbar,
            personopplysninger,
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
    }
);

export { KlagebehandlingProvider, useKlagebehandling };
