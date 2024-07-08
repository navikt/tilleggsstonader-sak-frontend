import { Behandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/behandlingshistorikk';
import {
    Klagebehandling,
    utfallTilTekst,
} from '../../App/typer/klagebehandling/klagebehandling';
import { KlageinstansEventType } from '../../../../typer/klage';
import { ensure } from '../../../../utils/utils';
import { KlagebehandlingSteg } from '../../App/typer/klagebehandling/klagebehandlingSteg';


import { behandlingResultatTilTekst } from '../../App/typer/klagebehandling/klagebehandlingResultat';

export const fjernDuplikatStegFraHistorikk = (steg: Behandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                ensure(historikkListe.find((steg) => historikk.steg == steg.steg))
            )
        ),
    ].reverse();

    const venterPåSvarFraKabal = visning[visning.length - 1].steg === KlagebehandlingSteg.OVERFØRING_TIL_KABAL;
    if (venterPåSvarFraKabal) {
        return [
            ...visning,
            lagHistorikkInnslag(KlagebehandlingSteg.KABAL_VENTER_SVAR),
            lagHistorikkInnslag(KlagebehandlingSteg.BEHANDLING_FERDIGSTILT),
        ];
    }
    return visning;
};

export const utledTekstForEksternutfall = (behandling: Klagebehandling) => {
    const erFeilregistrert = behandling.klageinstansResultat.some(
        (resultat) => resultat.type === KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

    if (erFeilregistrert) {
        return 'Behandling feilregistrert';
    }

    const klageResultatMedUtfall = behandling.klageinstansResultat.filter(
        (resultat) =>
            resultat.utfall && resultat.type == KlageinstansEventType.KLAGEBEHANDLING_AVSLUTTET
    );
    if (klageResultatMedUtfall.length > 0) {
        const utfall = klageResultatMedUtfall[0];
        if (utfall.utfall) {
            return utfallTilTekst[utfall.utfall];
        }
    }
};

export const utledTekstForBehandlingsresultat = (behandling: Klagebehandling) => {
    const eksternUtfallTekst = utledTekstForEksternutfall(behandling);
    return eksternUtfallTekst
        ? eksternUtfallTekst
        : behandlingResultatTilTekst[behandling.resultat];
};

const lagHistorikkInnslag = (steg: KlagebehandlingSteg): Behandlingshistorikk => ({
    behandlingId: '',
    steg: steg,
    opprettetAv: '',
    endretTid: '',
});
