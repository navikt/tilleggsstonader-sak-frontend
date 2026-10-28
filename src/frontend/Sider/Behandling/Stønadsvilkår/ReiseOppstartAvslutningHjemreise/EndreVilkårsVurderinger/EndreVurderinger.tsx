import React from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreDelvilkår } from './EndreDelvilkår';
import { SvarId } from '../../../../../typer/regel';
import { initierAktiveDelvilkår } from '../EndreVilkår/utils';
import { FeilmeldingerReiseOppstartAvslutningHjemreise } from '../EndreVilkår/validering';
import {
    RegelIdROAH,
    regelIdTilSpørsmålROAH,
    Regelstruktur,
    SvarAlternativ,
    TypeVilkårFakta,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    SvarOgBegrunnelse,
    SvarVilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    vurderinger: SvarVilkårReiseOppstartAvslutningHjemreise;
    regelstruktur: Regelstruktur;
    oppdaterVurderinger: (nyeSvar: SvarVilkårReiseOppstartAvslutningHjemreise) => void;
    oppdaterGjeldendeFaktaType: (gjeldendeFakta: TypeVilkårFakta) => void;
    feilmeldinger: FeilmeldingerReiseOppstartAvslutningHjemreise;
}

export const EndreVurderinger: React.FC<Props> = ({
    vurderinger,
    regelstruktur,
    oppdaterVurderinger,
    oppdaterGjeldendeFaktaType,
    feilmeldinger,
}) => {
    const aktiveVurderinger = initierAktiveDelvilkår(vurderinger, regelstruktur);

    const finnSvarMappingForRegel = (regelId: RegelIdROAH): SvarAlternativ[] => {
        return regelstruktur[regelId]?.svaralternativer ?? [];
    };

    const oppdaterVurdering = (endretRegelId: RegelIdROAH, nyVurdering: SvarOgBegrunnelse) => {
        const oppdaterteVurderinger = {
            ...vurderinger,
            [endretRegelId]: nyVurdering,
        };

        const reglerSomSkalNullstilles = regelstruktur[endretRegelId]?.reglerSomMåNullstilles ?? [];

        reglerSomSkalNullstilles.forEach((regelId) => {
            oppdaterteVurderinger[regelId] = undefined;
        });

        oppdaterVurderinger(oppdaterteVurderinger);
        const valgtAlternativ = finnSvarMappingForRegel(endretRegelId).find(
            (svaralternativ) => svaralternativ.svarId === nyVurdering.svar
        );
        oppdaterGjeldendeFaktaType(
            valgtAlternativ?.tilhørendeFaktaType ?? 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT'
        );
    };

    /**
     * Begrunnelse har egen oppdateringsfunksjon fordi vi ikke ønsker å nullstille
     * andre delvilkår eller oppdatere aktive spørsmål når kun begrunnelsen endres.
     */
    const oppdaterBegrunnelse = (regelId: RegelIdROAH, svar: SvarId, nyBegrunnelse: string) => {
        oppdaterVurderinger({
            ...vurderinger,
            [regelId]: { svar: svar, begrunnelse: nyBegrunnelse },
        });
    };

    const finnLabelForRegel = (regelId: RegelIdROAH): string => {
        return regelIdTilSpørsmålROAH[regelId] ?? regelId;
    };

    return (
        <VStack gap="space-16">
            {Array.from(aktiveVurderinger.entries())
                .filter(([, erAktiv]) => erAktiv)
                .map(([regelId]) => (
                    <EndreDelvilkår
                        key={regelId}
                        label={finnLabelForRegel(regelId)}
                        regelId={regelId}
                        vurdering={vurderinger[regelId]}
                        oppdaterVurdering={oppdaterVurdering}
                        oppdaterBegrunnelseIVurdering={oppdaterBegrunnelse}
                        svaralternativer={finnSvarMappingForRegel(regelId)}
                        feilmeldinger={feilmeldinger}
                    />
                ))}
        </VStack>
    );
};
