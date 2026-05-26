import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreDelvilkår } from './EndreDelvilkår';
import { useVilkårReiseTilSamling } from '../../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
import { SvarId } from '../../../../../typer/regel';
import { initierAktiveDelvilkår } from '../EndreVilkår/utils';
import { FeilmeldingerReiseTilSamling } from '../EndreVilkår/validering';
import {
    RegelIdReiseTilSamling,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseTilSamling';
import { SvarOgBegrunnelse, SvarVilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

interface Props {
    vurderinger: SvarVilkårReiseTilSamling;
    oppdaterVurderinger: (nyeSvar: SvarVilkårReiseTilSamling) => void;
    oppdaterGjeldendeFaktaType: (gjeldendeFakta: TypeVilkårFakta) => void;
    feilmeldinger: FeilmeldingerReiseTilSamling;
}

export const EndreVurderinger: React.FC<Props> = ({
    vurderinger,
    oppdaterVurderinger,
    oppdaterGjeldendeFaktaType,
    feilmeldinger,
}) => {
    const { regelstruktur } = useVilkårReiseTilSamling();

    const [aktiveVurderinger, settAktiveVurdering] = useState<Map<RegelIdReiseTilSamling, boolean>>(
        initierAktiveDelvilkår(vurderinger, regelstruktur)
    );

    const finnSvarMappingForRegel = (regelId: RegelIdReiseTilSamling): SvarAlternativ[] => {
        return regelstruktur[regelId].svaralternativer;
    };

    const oppdaterVurdering = (
        endretRegelId: RegelIdReiseTilSamling,
        nyVurdering: SvarOgBegrunnelse
    ) => {
        const oppdaterteVurderinger = {
            ...vurderinger,
            [endretRegelId]: nyVurdering,
        };

        const reglerSomSkalNullstilles = regelstruktur[endretRegelId].reglerSomMåNullstilles;

        reglerSomSkalNullstilles.forEach((regelId) => {
            oppdaterteVurderinger[regelId] = undefined;
        });

        oppdaterVurderinger(oppdaterteVurderinger);

        oppdaterAktiveSpørsmålOgGjeldedeFaktaType(
            reglerSomSkalNullstilles,
            endretRegelId,
            nyVurdering.svar
        );
    };

    const oppdaterAktiveSpørsmålOgGjeldedeFaktaType = (
        reglerSomErNullstilt: RegelIdReiseTilSamling[],
        endretRegelId: RegelIdReiseTilSamling,
        nyttSvar: SvarId
    ) => {
        const aktiveVurderingerKopi = new Map(aktiveVurderinger);

        reglerSomErNullstilt.forEach((spørsmål) => {
            aktiveVurderingerKopi.set(spørsmål, false);
        });

        const svar = finnSvarMappingForRegel(endretRegelId).find(
            (svar) => svar.svarId === nyttSvar
        );

        if (svar?.nesteRegelId) {
            aktiveVurderingerKopi.set(svar.nesteRegelId, true);
        }

        settAktiveVurdering(aktiveVurderingerKopi);

        oppdaterGjeldendeFaktaType(svar?.tilhørendeFaktaType ?? 'REISE_TIL_SAMLING_UBESTEMT');
    };

    /**
     * Begrunnelse har egen oppdateringsfunksjon fordi vi ikke ønsker å nullstille
     * andre delvilkår eller oppdatere aktive spørsmål når kun begrunnelsen endres.
     */
    const oppdaterBegrunnelse = (
        regelId: RegelIdReiseTilSamling,
        svar: SvarId,
        nyBegrunnelse: string
    ) => {
        oppdaterVurderinger({
            ...vurderinger,
            [regelId]: { svar: svar, begrunnelse: nyBegrunnelse },
        });
    };

    return (
        <VStack gap="space-16">
            {aktiveVurderinger.get(RegelIdReiseTilSamling.AVSTAND_OVER_TRETTI_KM) && (
                <EndreDelvilkår
                    label="Er reiseavstanden 30 km eller mer?"
                    regelId={RegelIdReiseTilSamling.AVSTAND_OVER_TRETTI_KM}
                    vurdering={vurderinger.AVSTAND_OVER_TRETTI_KM}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseTilSamling.AVSTAND_OVER_TRETTI_KM
                    )}
                    feilmeldinger={feilmeldinger}
                    begrunnelseHjelpetekst="Du må fylle ut antall kilometer som er lagt til grunn for vurderingen"
                />
            )}
            {aktiveVurderinger.get(RegelIdReiseTilSamling.KAN_REISE_MED_OFFENTLIG_TRANSPORT) && (
                <EndreDelvilkår
                    label={'Har søker mulighet til å reise meg offentlig transport?'}
                    regelId={RegelIdReiseTilSamling.KAN_REISE_MED_OFFENTLIG_TRANSPORT}
                    vurdering={vurderinger.KAN_REISE_MED_OFFENTLIG_TRANSPORT}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseTilSamling.KAN_REISE_MED_OFFENTLIG_TRANSPORT
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(RegelIdReiseTilSamling.KAN_REISE_MED_EGEN_BIL) && (
                <EndreDelvilkår
                    label={'Kan søker benytte seg av privat bil?'}
                    regelId={RegelIdReiseTilSamling.KAN_REISE_MED_EGEN_BIL}
                    vurdering={vurderinger.KAN_REISE_MED_EGEN_BIL}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseTilSamling.KAN_REISE_MED_EGEN_BIL
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(RegelIdReiseTilSamling.DOKUMENTERTE_UTGIFTER) && (
                <EndreDelvilkår
                    label="Har søker dokumenterte utgifter til reisen?"
                    regelId={RegelIdReiseTilSamling.DOKUMENTERTE_UTGIFTER}
                    vurdering={vurderinger.DOKUMENTERTE_UTGIFTER}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseTilSamling.DOKUMENTERTE_UTGIFTER
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(RegelIdReiseTilSamling.DEKKET_AV_ANNET_STIPEND) && (
                <EndreDelvilkår
                    label="Er reisen dekket av et annet stipend?"
                    regelId={RegelIdReiseTilSamling.DEKKET_AV_ANNET_STIPEND}
                    vurdering={vurderinger.DEKKET_AV_ANNET_STIPEND}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseTilSamling.DEKKET_AV_ANNET_STIPEND
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
        </VStack>
    );
};
