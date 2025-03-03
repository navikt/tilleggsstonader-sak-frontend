import { Hjemmel } from './hjemmel';
import { VedtakValg, ÅrsakOmgjøring } from './vurderingValg';
import { harVerdi } from '../../../../utils/utils';
import { lagOmgjøringDto, lagOpprettholdelseDto, VurderingDto } from '../../hooks/useVurdering';

export interface Vurderingsfelter {
    vedtak?: VedtakValg;
    årsak?: ÅrsakOmgjøring;
    begrunnelseOmgjøring?: string;
    hjemler?: Hjemmel[];
    innstillingKlageinstans?: string;
    interntNotat?: string;
}

export function erNødvendigeFelterUtfylt(vurderinsfelter: Vurderingsfelter): boolean {
    const { vedtak } = vurderinsfelter;

    if (vedtak === VedtakValg.OMGJØR_VEDTAK) {
        const { årsak, begrunnelseOmgjøring } = vurderinsfelter;
        return harVerdi(årsak) && harVerdi(begrunnelseOmgjøring);
    } else {
        const { innstillingKlageinstans, hjemler } = vurderinsfelter;
        return harVerdi(innstillingKlageinstans) && !!hjemler && hjemler.length > 0;
    }
}

/*
 * Denne funksjonen antar at vurderingsfeltene er i en lovlig tilstand. Kaster feilmelding dersom det ikke stemmer.
 */
export function tilVurderingDto(vurderinger: Vurderingsfelter, behandlingId: string): VurderingDto {
    return vurderinger.vedtak === VedtakValg.OPPRETTHOLD_VEDTAK
        ? lagOpprettholdelseDto(
              behandlingId,
              vurderinger.hjemler!,
              vurderinger.innstillingKlageinstans!,
              vurderinger.interntNotat!
          )
        : lagOmgjøringDto(behandlingId, vurderinger.årsak!, vurderinger.begrunnelseOmgjøring!);
}
