import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../typer/ressurs';
import { Hjemmel } from '../Steg/Vurdering/hjemmel';
import { VedtakValg, ÅrsakOmgjøring } from '../Steg/Vurdering/vurderingValg';

interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

export type VurderingDto = OmgjøringDto | OpprettholdelseDto;

export interface OmgjøringDto {
    behandlingId: string;
    vedtak: VedtakValg.OMGJØR_VEDTAK;
    årsak: ÅrsakOmgjøring;
    begrunnelseOmgjøring: string;
}

export interface OpprettholdelseDto {
    behandlingId: string;
    vedtak: VedtakValg.OPPRETTHOLD_VEDTAK;
    hjemler: Hjemmel[];
    innstillingKlageinstans: string;
    interntNotat: string;
}

export function lagOmgjøringDto(
    behandlingId: string,
    årsak: ÅrsakOmgjøring,
    begrunnelseOmgjøring: string
): OmgjøringDto {
    return {
        behandlingId,
        vedtak: VedtakValg.OMGJØR_VEDTAK,
        årsak,
        begrunnelseOmgjøring,
    };
}

export function lagOpprettholdelseDto(
    behandlingId: string,
    hjemler: Hjemmel[],
    innstillingKlageinstans: string,
    interntNotat: string
): OpprettholdelseDto {
    return {
        behandlingId,
        vedtak: VedtakValg.OPPRETTHOLD_VEDTAK,
        hjemler,
        innstillingKlageinstans,
        interntNotat,
    };
}

export const useVurdering = () => {
    const { request } = useApp();

    const [vurdering, settVurdering] = useState<Ressurs<VurderingDto>>(byggTomRessurs);

    const [melding, settMelding] = useState<IMelding>();

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            request<VurderingDto, null>(`/api/klage/vurdering/${behandlingId}`).then(settVurdering);
        },
        [request]
    );

    const lagreVurdering = (
        vurdering: VurderingDto
    ): Promise<RessursSuksess<VurderingDto> | RessursFeilet> => {
        return request<VurderingDto, VurderingDto>(`/api/klage/vurdering`, 'POST', vurdering).then(
            (respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVurdering(respons);
                    settMelding({
                        tekst: 'Vurderingen er lagret',
                        type: 'success',
                    });
                } else {
                    settMelding({
                        tekst: respons.frontendFeilmelding || 'Noe gikk galt ved innsending',
                        type: 'error',
                    });
                }
                return respons;
            }
        );
    };

    return {
        lagreVurdering,
        vurdering,
        melding,
        settMelding,
        hentVurdering,
    };
};
