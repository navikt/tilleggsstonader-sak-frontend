import React, { useState } from 'react';

import { v7 } from 'uuid';

import { VStack } from '@navikt/ds-react';

import { MidlertidigBostedParaplyvilkår } from './MidlertidigBostedParaplyvilkår';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { LeggTilNyPeriodeKnapp } from '../EndreVilkår/LeggTilNyPeriodeKnapp';
import { RedigeringslåsROAH } from '../typer/vilkårReiseOppstartAvslutningHjemreise';

export const ParaplyvilkårListe: React.FC<{
    aktivitet: Aktivitet;
    kanLeggeTilNytt: boolean;
    redigeringslås: RedigeringslåsROAH;
}> = ({ aktivitet, kanLeggeTilNytt, redigeringslås }) => {
    const { paraplyvilkår } = useVilkårReiseOppstartAvslutningHjemreise();
    const [utkastIder, settUtkastIder] = useState<string[]>([]);
    const [feilmelding, settFeilmelding] = useState<string | undefined>(undefined);

    const leggTilUtkast = () => {
        const id = v7();
        if (redigeringslås.startRedigering(id)) {
            settFeilmelding(undefined);
            settUtkastIder((ider) => [...ider, id]);
        } else {
            settFeilmelding('Ferdigstill redigering av annet vilkår før du starter ny redigering');
        }
    };

    const lagredeParaplyvilkår = paraplyvilkår.filter(
        (vilkår) => vilkår.aktivitetId === aktivitet.globalId
    );

    if (lagredeParaplyvilkår.length === 0 && !kanLeggeTilNytt) {
        return null;
    }

    return (
        <VStack gap="space-12">
            {lagredeParaplyvilkår.map((vilkår) => (
                <MidlertidigBostedParaplyvilkår
                    key={vilkår.id}
                    aktivitet={aktivitet}
                    vilkår={vilkår}
                    redigeringsId={vilkår.id}
                    redigeringslås={redigeringslås}
                />
            ))}
            {utkastIder.map((id) => (
                <MidlertidigBostedParaplyvilkår
                    key={id}
                    aktivitet={aktivitet}
                    vilkår={undefined}
                    redigeringsId={id}
                    redigeringslås={redigeringslås}
                    fjernUtkast={() => settUtkastIder((ider) => ider.filter((i) => i !== id))}
                />
            ))}
            {kanLeggeTilNytt && (
                <LeggTilNyPeriodeKnapp
                    tekst="Legg til ny periode hvor bruker bor borte"
                    onKlikk={leggTilUtkast}
                    feilmelding={feilmelding}
                    onLukkFeilmelding={() => settFeilmelding(undefined)}
                />
            )}
        </VStack>
    );
};
