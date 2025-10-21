import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreDelvilkår } from './EndreDelvilkår';
import { useVilkårDagligReise } from '../../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { SvarId } from '../../../../../../typer/regel';
import {
    RegelIdDagligReise,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../../typer/regelstrukturDagligReise';
import { SvarOgBegrunnelse, SvarVilkårDagligReise } from '../../typer/vilkårDagligReise';
import { initierAktiveDelvilkår } from '../utils';

interface Props {
    vurderinger: SvarVilkårDagligReise;
    oppdaterVurderinger: (nyeSvar: SvarVilkårDagligReise) => void;
    oppdaterGjeldendeFaktaType: (gjeldendeFakta: TypeVilkårFakta | undefined) => void;
}

export const EndreVurderinger: React.FC<Props> = ({
    vurderinger,
    oppdaterVurderinger,
    oppdaterGjeldendeFaktaType,
}) => {
    const { regelstruktur } = useVilkårDagligReise();

    const [aktiveDelvilkår, settAktiveDelvilkår] = useState<Map<RegelIdDagligReise, boolean>>(
        initierAktiveDelvilkår(vurderinger, regelstruktur)
    );

    const finnSvarMappingForRegel = (regelId: RegelIdDagligReise): SvarAlternativ[] => {
        return regelstruktur[regelId].svaralternativer;
    };

    const oppdaterVurdering = (
        endretRegelId: RegelIdDagligReise,
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

        oppdaterAktiveSpørsmålOgFakta(reglerSomSkalNullstilles, endretRegelId, nyVurdering.svar);
    };

    const oppdaterAktiveSpørsmålOgFakta = (
        reglerSomErNullstilt: RegelIdDagligReise[],
        endretRegelId: RegelIdDagligReise,
        nyttSvar: SvarId
    ) => {
        const aktiveVurderingerKopi = new Map(aktiveDelvilkår);

        reglerSomErNullstilt.forEach((spørsmål) => {
            aktiveVurderingerKopi.set(spørsmål, false);
        });

        const svar = finnSvarMappingForRegel(endretRegelId).find(
            (svar) => svar.svarId === nyttSvar
        );

        if (svar?.nesteRegelId) {
            aktiveVurderingerKopi.set(svar.nesteRegelId, true);
        }

        settAktiveDelvilkår(aktiveVurderingerKopi);

        oppdaterGjeldendeFaktaType(svar?.triggerFakta);
    };

    /**
     * Begrunnelse har egen oppdateringsfunksjon fordi vi ikke ønsker å nullstille
     * andre delvilkår eller oppdatere aktive spørsmål når kun begrunnelsen endres.
     */
    const oppdaterBegrunnelse = (
        regelId: RegelIdDagligReise,
        svarId: SvarId,
        nyBegrunnelse: string
    ) => {
        oppdaterVurderinger({
            ...vurderinger,
            [regelId]: { svarId: svarId, begrunnelse: nyBegrunnelse },
        });
    };

    return (
        <VStack gap="4">
            <EndreDelvilkår
                label="Er reiseavstanden over 6km?"
                regelId={RegelIdDagligReise.AVSTAND_OVER_SEKS_KM}
                vurdering={vurderinger.AVSTAND_OVER_SEKS_KM}
                oppdaterVurdering={oppdaterVurdering}
                oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                svaralternativer={finnSvarMappingForRegel(RegelIdDagligReise.AVSTAND_OVER_SEKS_KM)}
            />
            {aktiveDelvilkår.get(RegelIdDagligReise.UNNTAK_SEKS_KM) && (
                // TODO: Finn ut riktig formulering for unntak
                <EndreDelvilkår
                    label="Har søker funksjonsnedsettelse, midlertidig skade eller sykdom som gjør at hen må ha transport til aktivitetsstedet?"
                    regelId={RegelIdDagligReise.UNNTAK_SEKS_KM}
                    vurdering={vurderinger?.UNNTAK_SEKS_KM}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(RegelIdDagligReise.UNNTAK_SEKS_KM)}
                    erUndervilkår
                />
            )}
            {aktiveDelvilkår.get(RegelIdDagligReise.KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT) && (
                <EndreDelvilkår
                    label="Kan søker benytte seg av offentlig transport?"
                    regelId={RegelIdDagligReise.KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT}
                    vurdering={vurderinger?.KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdDagligReise.KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT
                    )}
                />
            )}
            {aktiveDelvilkår.get(RegelIdDagligReise.KAN_BRUKER_KJØRE_SELV) && (
                <VStack>
                    <EndreDelvilkår
                        label="Kan bruker benytte privat bil?"
                        regelId={RegelIdDagligReise.KAN_BRUKER_KJØRE_SELV}
                        vurdering={vurderinger?.KAN_BRUKER_KJØRE_SELV}
                        oppdaterVurdering={oppdaterVurdering}
                        oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                        svaralternativer={finnSvarMappingForRegel(
                            RegelIdDagligReise.KAN_BRUKER_KJØRE_SELV
                        )}
                    />
                </VStack>
            )}
        </VStack>
    );
};
