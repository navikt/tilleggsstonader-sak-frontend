import {
    Begrunnelse,
    BegrunnelseRegel,
    Regel,
    RegelId,
    Regler,
    Svaralternativ,
} from '../../../typer/regel';
import { harIkkeVerdi, harVerdi } from '../../../utils/utils';
import { Delvilkår, Vurdering } from '../vilkår';

export const manglerBegrunnelse = (begrunnelse: string | undefined | null): boolean => {
    return !begrunnelse || begrunnelse.trim().length === 0;
};

export function begrunnelseErPåkrevdOgMangler(
    svarsalternativ: Svaralternativ,
    begrunnelse: Begrunnelse
): boolean {
    if (svarsalternativ.begrunnelseType === BegrunnelseRegel.PÅKREVD) {
        return manglerBegrunnelse(begrunnelse);
    }
    return false;
}

export function begrunnelseErPåkrevdOgUtfyllt(
    svarsalternativ: Svaralternativ,
    begrunnelse: Begrunnelse
): boolean {
    if (svarsalternativ.begrunnelseType === BegrunnelseRegel.PÅKREVD) {
        return !begrunnelse || begrunnelse.trim().length > 0;
    }
    return true;
}

export const forventerBegrunnelsePåAlleSvarsalternativ = (regel: Regel) => {
    const svaralternativ = Object.values(regel.svarMapping);
    return (
        svaralternativ.length > 0 &&
        svaralternativ.every((svar) => svar.begrunnelseType !== BegrunnelseRegel.UTEN)
    );
};

export function hentSvaralternativ(
    regler: Regler,
    vurdering: Vurdering
): Svaralternativ | undefined {
    if (!vurdering.svar) {
        return undefined;
    } else {
        const regel = regler[vurdering.regelId];
        return regel.svarMapping[vurdering.svar];
    }
}

export function erAlleDelvilkårBesvarte(delvilkårsett: Delvilkår[], regler: Regler): boolean {
    const erPåSisteNod = delvilkårsett
        .map((delvilkår) => delvilkår.vurderinger)
        .map((listeMedVurderinger) => listeMedVurderinger[listeMedVurderinger.length - 1])
        .every((sisteVurderingen) => {
            if (!sisteVurderingen.svar) {
                return false;
            }
            const svarsalternativ = hentSvaralternativ(regler, sisteVurderingen);
            return svarsalternativ?.regelId === 'SLUTT_NODE';
        });

    const harBesvartAllePåkrevdeBegrunnelser = delvilkårsett
        .map((delvilkår) => delvilkår.vurderinger)
        .every((delvilkår) =>
            delvilkår.every((vurdering) => {
                if (!vurdering.svar) {
                    return false;
                }
                const svarsalternativ = hentSvaralternativ(regler, vurdering);
                return (
                    svarsalternativ &&
                    !begrunnelseErPåkrevdOgMangler(svarsalternativ, vurdering.begrunnelse)
                );
            })
        );

    return erPåSisteNod && harBesvartAllePåkrevdeBegrunnelser;
}

export function leggTilNesteIdHvis(
    nesteRegelId: RegelId,
    nySvarArray: Vurdering[],
    hvisFunksjon: () => boolean
): Vurdering[] {
    const inneholderAlleredeNesteRegelId = nySvarArray.some((v) => v.regelId === nesteRegelId);
    if (nesteRegelId !== 'SLUTT_NODE' && !inneholderAlleredeNesteRegelId && hvisFunksjon()) {
        return [...nySvarArray, { regelId: nesteRegelId }];
    }
    return nySvarArray;
}

export const kanHaBegrunnelse = (svarsalternativ: Svaralternativ) =>
    svarsalternativ.begrunnelseType !== BegrunnelseRegel.UTEN;

export const oppdaterSvarIListe = (
    nyttSvar: Vurdering,
    vurderinger: Vurdering[],
    beholdResterendeSvar = false,
    beholdBeskrivelse = false
): Vurdering[] => {
    const { svar, regelId } = nyttSvar;

    const svarIndex = vurderinger.findIndex((s) => s.regelId === regelId);
    const nySvarArray = vurderinger.slice(0, svarIndex);

    if (!svar) {
        return vurderinger;
    }

    const oppdatertNyttSvar = beholdBeskrivelse
        ? { ...nyttSvar, begrunnelse: vurderinger[svarIndex].begrunnelse }
        : nyttSvar;
    return [...nySvarArray, oppdatertNyttSvar].concat(
        beholdResterendeSvar ? [...vurderinger.slice(svarIndex + 1)] : []
    );
};

const harBegrunnelsePåNesteRegel = (svarsalternativer: Svaralternativ, regler: Regler) =>
    svarsalternativer.regelId !== 'SLUTT_NODE' &&
    forventerBegrunnelsePåAlleSvarsalternativ(regler[svarsalternativer.regelId]);

export const kopierBegrunnelse = (
    tidligereVurderinger: Vurdering[],
    nyeVurderinger: Vurdering[],
    nyttSvar: Vurdering,
    svarsalternativer: Svaralternativ,
    regler: Regler
) => {
    const svarIndex = tidligereVurderinger.findIndex((s) => s.regelId === nyttSvar.regelId);

    const skalFlytteBegrunnelseEnNivåNed =
        harVerdi(tidligereVurderinger[svarIndex].begrunnelse) &&
        harIkkeVerdi(nyeVurderinger[svarIndex].begrunnelse) &&
        harBegrunnelsePåNesteRegel(svarsalternativer, regler);

    const skalFlytteBegrunnelseEnNivåOpp =
        tidligereVurderinger.length > svarIndex + 1 &&
        harVerdi(tidligereVurderinger[svarIndex + 1].begrunnelse) &&
        harIkkeVerdi(nyeVurderinger[svarIndex].begrunnelse) &&
        kanHaBegrunnelse(svarsalternativer);

    if (skalFlytteBegrunnelseEnNivåNed) {
        return nyeVurderinger.map((vurdering, index) =>
            index === svarIndex + 1
                ? { ...vurdering, begrunnelse: tidligereVurderinger[svarIndex].begrunnelse }
                : vurdering
        );
    } else if (skalFlytteBegrunnelseEnNivåOpp) {
        return nyeVurderinger.map((vurdering, index) =>
            index === svarIndex
                ? { ...vurdering, begrunnelse: tidligereVurderinger[svarIndex + 1].begrunnelse }
                : vurdering
        );
    } else {
        return nyeVurderinger;
    }
};
