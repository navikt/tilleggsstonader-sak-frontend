import React from 'react';

import { VStack } from '@navikt/ds-react';

import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { NyttVilkårReiseOppstartAvslutningHjemreise } from '../EndreVilkår/NyttVilkårReiseOppstartAvslutningHjemreise';
import {
    ParaplyvilkårReiseOppstartAvslutningHjemreise,
    RedigeringslåsROAH,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';
import { VisEllerEndreVilkårReiseOppstartAvslutningHjemreise } from '../VisEllerEndreVilkårReiseOppstartAvslutningHjemreise';

export const ReiserIParaplyvilkår: React.FC<{
    aktivitet: Aktivitet;
    paraplyvilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise;
    kanLeggeTilReise: boolean;
    redigeringslås: RedigeringslåsROAH;
}> = ({ aktivitet, paraplyvilkår, kanLeggeTilReise, redigeringslås }) => {
    const {
        reiser: alleReiser,
        lagreNyttVilkår,
        oppdaterVilkår,
        slettVilkår,
    } = useVilkårReiseOppstartAvslutningHjemreise();

    const { redigererId, startRedigering, avsluttRedigering } = redigeringslås;
    const nyReiseId = `ny-reise-${paraplyvilkår.id}`;

    // Vilkår uten globalId kan ikke refereres til, så de har ingen reiser
    const reiser = paraplyvilkår.globalId
        ? alleReiser.filter((vilkår) => vilkår.parentVilkår === paraplyvilkår.globalId)
        : [];

    return (
        <VStack gap="space-16">
            {reiser.map((reise) => (
                <VisEllerEndreVilkårReiseOppstartAvslutningHjemreise
                    key={reise.id}
                    vilkår={reise}
                    aktivitet={aktivitet}
                    redigerer={redigererId === reise.id}
                    redigererAnnetVilkår={redigererId !== undefined && redigererId !== reise.id}
                    startRedigering={() => startRedigering(reise.id)}
                    avsluttRedigering={avsluttRedigering}
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
                    leggerTilNyttVilkår={redigererId === nyReiseId}
                    startRedigering={() => startRedigering(nyReiseId)}
                    avsluttRedigering={avsluttRedigering}
                    lagre={(vilkår) =>
                        lagreNyttVilkår({ ...vilkår, parentVilkår: paraplyvilkår.globalId })
                    }
                />
            )}
        </VStack>
    );
};
