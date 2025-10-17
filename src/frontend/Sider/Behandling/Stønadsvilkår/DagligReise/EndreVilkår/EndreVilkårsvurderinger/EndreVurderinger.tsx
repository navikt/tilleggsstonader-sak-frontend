import React, { Dispatch, SetStateAction, useState } from 'react';

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
    settVurderinger: Dispatch<SetStateAction<SvarVilkårDagligReise>>;
    oppdaterGjeldendeFaktaType: (gjeldendeFakta: TypeVilkårFakta | undefined) => void;
}

export const EndreVurderinger: React.FC<Props> = ({
    vurderinger,
    settVurderinger,
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

        settVurderinger(oppdaterteVurderinger);

        oppdaterAktiveSpørsmålOgFakta(reglerSomSkalNullstilles, endretRegelId, nyVurdering.svarId);
    };

    // TODO: Endring av begrunnelse skal ikke nullstille andre spørsmål

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

    return (
        <VStack>
            <EndreDelvilkår
                label="Er reiseavstanden over 6km?"
                regelId={RegelIdDagligReise.AVSTAND_OVER_SEKS_KM}
                vurdering={vurderinger.AVSTAND_OVER_SEKS_KM}
                oppdaterVurdering={oppdaterVurdering}
                svaralternativer={finnSvarMappingForRegel(RegelIdDagligReise.AVSTAND_OVER_SEKS_KM)}
            />
            {aktiveDelvilkår.get(RegelIdDagligReise.UNNTAK_SEKS_KM) && (
                // TODO: Finn ut riktig formulering for unntak
                <EndreDelvilkår
                    label="Har søker funksjonsnedsettelse, midlertidig skade eller sykdom som gjør at hen må ha transport til aktivitetsstedet?"
                    regelId={RegelIdDagligReise.UNNTAK_SEKS_KM}
                    vurdering={vurderinger?.UNNTAK_SEKS_KM}
                    oppdaterVurdering={oppdaterVurdering}
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
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdDagligReise.KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT
                    )}
                />
            )}
            {aktiveDelvilkår.get(RegelIdDagligReise.KAN_BRUKER_KJØRE_SELV) && (
                <EndreDelvilkår
                    label="Kan bruker benytte privat bil?"
                    regelId={RegelIdDagligReise.KAN_BRUKER_KJØRE_SELV}
                    vurdering={vurderinger?.KAN_BRUKER_KJØRE_SELV}
                    oppdaterVurdering={oppdaterVurdering}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdDagligReise.KAN_BRUKER_KJØRE_SELV
                    )}
                />
            )}
        </VStack>
    );
};
