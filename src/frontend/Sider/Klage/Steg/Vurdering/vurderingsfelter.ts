import { Hjemmel } from './hjemmel';
import { VedtakValg, ÅrsakOmgjøring } from './vurderingValg';
import { harVerdi } from '../../../../utils/utils';
import { lagOmgjøringDto, lagOpprettholdelseDto, VurderingDto } from '../../hooks/useVurdering';

export interface Vurderingsfelter {
    vedtak?: VedtakValg;
    årsak?: ÅrsakOmgjøring;
    begrunnelseOmgjøring?: string;
    hjemmel?: Hjemmel;
    innstillingKlageinstans?: string;
    interntNotat?: string;
}

export function erNødvendigeFelterUtfylt(vurderinsfelter: Vurderingsfelter): boolean {
    const { vedtak } = vurderinsfelter;

    if (vedtak === VedtakValg.OMGJØR_VEDTAK) {
        const { årsak, begrunnelseOmgjøring } = vurderinsfelter;
        return harVerdi(årsak) && harVerdi(begrunnelseOmgjøring);
    } else {
        const { innstillingKlageinstans, hjemmel } = vurderinsfelter;
        return harVerdi(innstillingKlageinstans) && harVerdi(hjemmel);
    }
}

/*
 * Denne funksjonen antar at vurderingsfeltene er i en lovlig tilstand. Kaster feilmelding dersom det ikke stemmer.
 */
export function tilVurderingDto(vurderinger: Vurderingsfelter, behandlingId: string): VurderingDto {
    return vurderinger.vedtak === VedtakValg.OPPRETTHOLD_VEDTAK
        ? lagOpprettholdelseDto(
              behandlingId,
              vurderinger.hjemmel!,
              vurderinger.innstillingKlageinstans!,
              vurderinger.interntNotat!
          )
        : lagOmgjøringDto(behandlingId, vurderinger.årsak!, vurderinger.begrunnelseOmgjøring!);
}
