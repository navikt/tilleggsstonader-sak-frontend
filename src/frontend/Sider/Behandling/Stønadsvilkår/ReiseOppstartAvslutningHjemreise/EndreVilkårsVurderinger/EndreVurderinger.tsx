import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreDelvilkår } from './EndreDelvilkår';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { SvarId } from '../../../../../typer/regel';
import { initierAktiveDelvilkår } from '../EndreVilkår/utils';
import { FeilmeldingerReiseOppstartAvslutningHjemreise } from '../EndreVilkår/validering';
import {
    RegelIdReiseOppstartAvslutningHjemreise,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    SvarOgBegrunnelse,
    SvarVilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    vurderinger: SvarVilkårReiseOppstartAvslutningHjemreise;
    oppdaterVurderinger: (nyeSvar: SvarVilkårReiseOppstartAvslutningHjemreise) => void;
    oppdaterGjeldendeFaktaType: (gjeldendeFakta: TypeVilkårFakta) => void;
    feilmeldinger: FeilmeldingerReiseOppstartAvslutningHjemreise;
}

export const EndreVurderinger: React.FC<Props> = ({
    vurderinger,
    oppdaterVurderinger,
    oppdaterGjeldendeFaktaType,
    feilmeldinger,
}) => {
    const { regelstruktur } = useVilkårReiseOppstartAvslutningHjemreise();

    const [aktiveVurderinger, settAktiveVurdering] = useState<
        Map<RegelIdReiseOppstartAvslutningHjemreise, boolean>
    >(initierAktiveDelvilkår(vurderinger, regelstruktur));

    const finnSvarMappingForRegel = (
        regelId: RegelIdReiseOppstartAvslutningHjemreise
    ): SvarAlternativ[] => {
        return regelstruktur[regelId].svaralternativer;
    };

    const oppdaterVurdering = (
        endretRegelId: RegelIdReiseOppstartAvslutningHjemreise,
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
        reglerSomErNullstilt: RegelIdReiseOppstartAvslutningHjemreise[],
        endretRegelId: RegelIdReiseOppstartAvslutningHjemreise,
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

        oppdaterGjeldendeFaktaType(
            svar?.tilhørendeFaktaType ?? 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT'
        );
    };

    /**
     * Begrunnelse har egen oppdateringsfunksjon fordi vi ikke ønsker å nullstille
     * andre delvilkår eller oppdatere aktive spørsmål når kun begrunnelsen endres.
     */
    const oppdaterBegrunnelse = (
        regelId: RegelIdReiseOppstartAvslutningHjemreise,
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
            {aktiveVurderinger.get(
                RegelIdReiseOppstartAvslutningHjemreise.KAN_REISE_MED_OFFENTLIG_TRANSPORT
            ) && (
                <EndreDelvilkår
                    label={'Har søker mulighet til å reise med offentlig transport?'}
                    regelId={
                        RegelIdReiseOppstartAvslutningHjemreise.KAN_REISE_MED_OFFENTLIG_TRANSPORT
                    }
                    vurdering={vurderinger.KAN_REISE_MED_OFFENTLIG_TRANSPORT}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseOppstartAvslutningHjemreise.KAN_REISE_MED_OFFENTLIG_TRANSPORT
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
            {aktiveVurderinger.get(
                RegelIdReiseOppstartAvslutningHjemreise.KAN_REISE_MED_EGEN_BIL
            ) && (
                <EndreDelvilkår
                    label={'Kan søker benytte seg av privat bil?'}
                    regelId={RegelIdReiseOppstartAvslutningHjemreise.KAN_REISE_MED_EGEN_BIL}
                    vurdering={vurderinger.KAN_REISE_MED_EGEN_BIL}
                    oppdaterVurdering={oppdaterVurdering}
                    oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                    svaralternativer={finnSvarMappingForRegel(
                        RegelIdReiseOppstartAvslutningHjemreise.KAN_REISE_MED_EGEN_BIL
                    )}
                    feilmeldinger={feilmeldinger}
                />
            )}
        </VStack>
    );
};
