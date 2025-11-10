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
import { FeilmeldingerDagligReise } from '../validering';

interface Props {
    vurderinger: SvarVilkårDagligReise;
    oppdaterVurderinger: (nyeSvar: SvarVilkårDagligReise) => void;
    oppdaterGjeldendeFaktaType: (gjeldendeFakta: TypeVilkårFakta | undefined) => void;
    feilmeldinger: FeilmeldingerDagligReise;
}

export const EndreVurderinger: React.FC<Props> = ({
    vurderinger,
    oppdaterVurderinger,
    oppdaterGjeldendeFaktaType,
    feilmeldinger,
}) => {
    const { regelstruktur } = useVilkårDagligReise();

    const [aktiveVurderinger, settAktiveVurdering] = useState<Map<RegelIdDagligReise, boolean>>(
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

        oppdaterAktiveSpørsmålOgGjeldedeFaktaType(
            reglerSomSkalNullstilles,
            endretRegelId,
            nyVurdering.svar
        );
    };

    const oppdaterAktiveSpørsmålOgGjeldedeFaktaType = (
        reglerSomErNullstilt: RegelIdDagligReise[],
        endretRegelId: RegelIdDagligReise,
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

        oppdaterGjeldendeFaktaType(svar?.tilhørendeFaktaType);
    };

    /**
     * Begrunnelse har egen oppdateringsfunksjon fordi vi ikke ønsker å nullstille
     * andre delvilkår eller oppdatere aktive spørsmål når kun begrunnelsen endres.
     */
    const oppdaterBegrunnelse = (
        regelId: RegelIdDagligReise,
        svar: SvarId,
        nyBegrunnelse: string
    ) => {
        oppdaterVurderinger({
            ...vurderinger,
            [regelId]: { svar: svar, begrunnelse: nyBegrunnelse },
        });
    };

    return (
        <VStack gap="4">
            {aktiveVurderinger.get(RegelIdDagligReise.AVSTAND_OVER_SEKS_KM) && (
                <EndreDelvilkår
                    label="Er reiseavstanden 6 km eller mer?"
                    regelId={RegelIdDagligReise.AVSTAND_OVER_SEKS_KM}
                    vurdering={vurderinger.AVSTAND_OVER_SEKS_KM}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdDagligReise.AVSTAND_OVER_SEKS_KM
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(RegelIdDagligReise.UNNTAK_SEKS_KM) && (
                <EndreDelvilkår
                    label="Har søker dokumentert funksjonsnedsettelse, midlertidig skade eller sykdom som gjør at søker har et særskilt behov for transport?"
                    regelId={RegelIdDagligReise.UNNTAK_SEKS_KM}
                    vurdering={vurderinger?.UNNTAK_SEKS_KM}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(RegelIdDagligReise.UNNTAK_SEKS_KM)}
                    erUndervilkår
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(RegelIdDagligReise.KAN_REISE_MED_OFFENTLIG_TRANSPORT) && (
                <EndreDelvilkår
                    label="Kan søker benytte seg av offentlig transport?"
                    regelId={RegelIdDagligReise.KAN_REISE_MED_OFFENTLIG_TRANSPORT}
                    vurdering={vurderinger?.KAN_REISE_MED_OFFENTLIG_TRANSPORT}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdDagligReise.KAN_REISE_MED_OFFENTLIG_TRANSPORT
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(RegelIdDagligReise.KAN_KJØRE_MED_EGEN_BIL) && (
                <EndreDelvilkår
                    label="Kan søker benytte privat bil?"
                    regelId={RegelIdDagligReise.KAN_KJØRE_MED_EGEN_BIL}
                    vurdering={vurderinger?.KAN_KJØRE_MED_EGEN_BIL}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdDagligReise.KAN_KJØRE_MED_EGEN_BIL
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
        </VStack>
    );
};
