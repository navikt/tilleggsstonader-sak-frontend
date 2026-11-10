import React, { useState } from 'react';

import { v7 } from 'uuid';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { MidlertidigBostedParaplyvilkår } from './MidlertidigBostedParaplyvilkår';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';

export const ParaplyvilkårListe: React.FC<{
    aktivitet: Aktivitet;
    kanLeggeTilNytt: boolean;
}> = ({ aktivitet, kanLeggeTilNytt }) => {
    const { paraplyvilkår } = useVilkårReiseOppstartAvslutningHjemreise();
    const [utkastIder, settUtkastIder] = useState<string[]>([]);

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
                />
            ))}
            {utkastIder.map((id) => (
                <MidlertidigBostedParaplyvilkår
                    key={id}
                    aktivitet={aktivitet}
                    vilkår={undefined}
                    fjernUtkast={() => settUtkastIder((ider) => ider.filter((i) => i !== id))}
                />
            ))}
            {kanLeggeTilNytt && (
                <div>
                    <SmallButton
                        type="button"
                        variant="secondary"
                        icon={<PlusCircleIcon />}
                        onClick={() => settUtkastIder((ider) => [...ider, v7()])}
                    >
                        Legg til ny periode hvor bruker bor borte
                    </SmallButton>
                </div>
            )}
        </VStack>
    );
};
