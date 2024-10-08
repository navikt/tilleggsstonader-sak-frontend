export enum TotrinnskontrollStatus {
    IKKE_AUTORISERT = 'IKKE_AUTORISERT',
    TOTRINNSKONTROLL_UNDERKJENT = 'TOTRINNSKONTROLL_UNDERKJENT',
    UAKTUELT = 'UAKTUELT',
    KAN_FATTE_VEDTAK = 'KAN_FATTE_VEDTAK',
}

export type TotrinnskontrollResponse =
    | {
          status: TotrinnskontrollStatus.IKKE_AUTORISERT;
          totrinnskontroll: TotrinnskontrollOpprettet;
      }
    | {
          status: TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT;
          totrinnskontroll: TotrinnskontrollUnderkjentResponse;
      }
    | {
          status: TotrinnskontrollStatus.KAN_FATTE_VEDTAK | TotrinnskontrollStatus.UAKTUELT;
      };

export type TotrinnskontrollOpprettet = {
    opprettetAv: string;
    opprettetTid: string;
};

export type TotrinnskontrollUnderkjentResponse = TotrinnskontrollOpprettet & {
    begrunnelse: string;
    årsakerUnderkjent: ÅrsakUnderkjent[];
};

export enum ÅrsakUnderkjent {
    VEDTAK_OG_BEREGNING = 'VEDTAK_OG_BEREGNING',
    VEDTAKSBREV = 'VEDTAKSBREV',
    FEIL_I_UTGIFTER = 'FEIL_I_UTGIFTER',
    RETUR_ETTER_ØNSKE_FRA_SAKSBEHANDLER = 'RETUR_ETTER_ØNSKE_FRA_SAKSBEHANDLER',
}

export const årsakUnderkjentTilTekst: Record<ÅrsakUnderkjent, string> = {
    VEDTAK_OG_BEREGNING: 'Vedtak og beregning',
    VEDTAKSBREV: 'Vedtaksbrev',
    FEIL_I_UTGIFTER: 'Feil i utgifter',
    RETUR_ETTER_ØNSKE_FRA_SAKSBEHANDLER: 'Retur etter ønske fra saksbehandler',
};
