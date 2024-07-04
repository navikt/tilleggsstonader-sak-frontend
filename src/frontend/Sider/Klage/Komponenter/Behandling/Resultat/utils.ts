import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    Klagebehandling,
    behandlingResultatTilTekst,
    StegType,
    utfallTilTekst,
} from '../../../App/typer/fagsak';
import { KlageinstansEventType } from '../../../../../typer/klage';
import { ensure } from '../../../../../utils/utils';

export const fjernDuplikatStegFraHistorikk = (steg: IBehandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                ensure(historikkListe.find((steg) => historikk.steg == steg.steg))
            )
        ),
    ].reverse();

    const venterPåSvarFraKabal = visning[visning.length - 1].steg === StegType.OVERFØRING_TIL_KABAL;
    if (venterPåSvarFraKabal) {
        return [
            ...visning,
            lagHistorikkInnslag(StegType.KABAL_VENTER_SVAR),
            lagHistorikkInnslag(StegType.BEHANDLING_FERDIGSTILT),
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

const lagHistorikkInnslag = (steg: StegType): IBehandlingshistorikk => ({
    behandlingId: '',
    steg: steg,
    opprettetAv: '',
    endretTid: '',
});
