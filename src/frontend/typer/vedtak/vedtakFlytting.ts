import { Vedtaksperiode } from './vedtakperiode';
import { VedtaksperiodeTsrDto } from '../../Sider/Behandling/VedtakOgBeregning/Felles/vedtaksperioder/vedtaksperiodeUtils';

export interface InnvilgelseFlytting {
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatFlytting;
    begrunnelse: string | null;
}

export interface InnvilgelseFlyttingRequest {
    vedtaksperioder: Vedtaksperiode[] | VedtaksperiodeTsrDto[];
    begrunnelse?: string;
}

export interface BeregningsresultatFlytting {
    resultater: BeregningsresultatFlyttevilkår[];
}

export type BeregningsresultatFlyttevilkår = {
    vilkårId: string;
    fom: string;
    tom: string;
    beløp: number;
} & (
    | {
          flyttemåte: 'FLYTTEBYRÅ';
          grunnlag: {
              type: 'FLYTTEBYRÅ';
              tilbud1Pris: number;
              tilbud2Pris: number;
          };
      }
    | {
          flyttemåte: 'EGEN_KJØRING';
          grunnlag: {
              type: 'EGEN_KJØRING';
              avstandEnVei: number;
              sats: number;
              satsBekreftet: boolean;
              henger: number;
              bompenger: number;
              ferge: number;
              parkering: number;
          };
      }
);
