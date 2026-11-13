import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { NyttVilkårReiseOppstartAvslutningHjemreise } from '../EndreVilkår/NyttVilkårReiseOppstartAvslutningHjemreise';
import { ParaplyvilkårReiseOppstartAvslutningHjemreise } from '../typer/vilkårReiseOppstartAvslutningHjemreise';
import { VisEllerEndreVilkårReiseOppstartAvslutningHjemreise } from '../VisEllerEndreVilkårReiseOppstartAvslutningHjemreise';

export const ReiserIParaplyvilkår: React.FC<{
    aktivitet: Aktivitet;
    paraplyvilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise;
    kanLeggeTilReise: boolean;
}> = ({ aktivitet, paraplyvilkår, kanLeggeTilReise }) => {
    const {
        reiser: alleReiser,
        lagreNyttVilkår,
        oppdaterVilkår,
        slettVilkår,
    } = useVilkårReiseOppstartAvslutningHjemreise();

    const [redigererIder, settRedigererIder] = useState<string[]>([]);
    const [leggerTilNyReise, settLeggerTilNyReise] = useState(false);

    // Vilkår uten globalId kan ikke refereres til, så de har ingen reiser
    const reiser = paraplyvilkår.globalId
        ? alleReiser.filter((vilkår) => vilkår.parentVilkår === paraplyvilkår.globalId)
        : [];

    const startRedigering = (id: string) => {
        settRedigererIder((ider) => (ider.includes(id) ? ider : [...ider, id]));
        return true;
    };

    const avsluttRedigering = (id: string) =>
        settRedigererIder((ider) => ider.filter((redigererId) => redigererId !== id));

    return (
        <VStack gap="space-16">
            {reiser.map((reise) => (
                <VisEllerEndreVilkårReiseOppstartAvslutningHjemreise
                    key={reise.id}
                    vilkår={reise}
                    aktivitet={aktivitet}
                    redigerer={redigererIder.includes(reise.id)}
                    redigererAnnetVilkår={false}
                    startRedigering={() => startRedigering(reise.id)}
                    avsluttRedigering={() => avsluttRedigering(reise.id)}
                    lagre={(vilkår) =>
                        oppdaterVilkår(reise.id, {
                            ...vilkår,
                            parentVilkår: paraplyvilkår.globalId,
                        })
                    }
                    slett={slettVilkår}
                />
            ))}
            {kanLeggeTilReise && (
                <NyttVilkårReiseOppstartAvslutningHjemreise
                    aktivitet={aktivitet}
                    leggerTilNyttVilkår={leggerTilNyReise}
                    startRedigering={() => {
                        settLeggerTilNyReise(true);
                        return true;
                    }}
                    avsluttRedigering={() => settLeggerTilNyReise(false)}
                    lagre={(vilkår) =>
                        lagreNyttVilkår({ ...vilkår, parentVilkår: paraplyvilkår.globalId })
                    }
                />
            )}{' '}
        </VStack>
    );
};
