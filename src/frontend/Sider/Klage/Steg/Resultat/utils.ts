import { ensure } from '../../../../utils/utils';
import { Behandlingshistorikk } from '../../typer/behandlingshistorikk';
import { KlagebehandlingSteg } from '../../typer/klagebehandling/klagebehandlingSteg';

export const fjernDuplikatStegFraHistorikk = (steg: Behandlingshistorikk[]) => {
    const visning = [
        ...new Set(
            steg.map((historikk, _, historikkListe) =>
                ensure(historikkListe.find((steg) => historikk.steg == steg.steg))
            )
        ),
    ].reverse();

    const venterPåSvarFraKabal =
        visning[visning.length - 1].steg === KlagebehandlingSteg.OVERFØRING_TIL_KABAL;
    if (venterPåSvarFraKabal) {
        return [
            ...visning,
            lagHistorikkInnslag(KlagebehandlingSteg.KABAL_VENTER_SVAR),
            lagHistorikkInnslag(KlagebehandlingSteg.BEHANDLING_FERDIGSTILT),
        ];
    }
    return visning;
};

const lagHistorikkInnslag = (steg: KlagebehandlingSteg): Behandlingshistorikk => ({
    steg: steg,
    hendelse: steg,
    endretAvNavn: '',
    endretTid: '',
});
