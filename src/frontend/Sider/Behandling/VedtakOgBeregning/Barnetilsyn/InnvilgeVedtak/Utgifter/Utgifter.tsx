import React, { Dispatch, SetStateAction } from 'react';

import { VStack } from '@navikt/ds-react';

import UtgifterValg from './UtgifterValg';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../../hooks/felles/useRecordState';
import { Utgift } from '../../../../../../typer/vedtak';
import { GrunnlagBarn } from '../../../../vilkår';
import { InnvilgeVedtakForm } from '../InnvilgeBarnetilsyn';

interface Props {
    errorState: FormErrors<Record<string, Utgift[]>>;
    utgifterState: RecordState<Utgift[]>;
    barnMedOppfylteVilkår: GrunnlagBarn[];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const Utgifter: React.FC<Props> = ({
    utgifterState,
    barnMedOppfylteVilkår,
    errorState,
    settValideringsFeil,
}) => {
    return (
        <VStack gap="12">
            {barnMedOppfylteVilkår.map((barn) => (
                <UtgifterValg
                    barn={barn}
                    utgifter={utgifterState.value[barn.barnId]}
                    errorState={errorState && errorState[barn.barnId]}
                    key={barn.barnId}
                    oppdaterUtgiter={(utgifter: Utgift[]) =>
                        utgifterState.update(barn.barnId, utgifter)
                    }
                    settValideringsFeil={settValideringsFeil}
                />
            ))}
        </VStack>
    );
};

export default Utgifter;
