import React, { SetStateAction } from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Alert, ExpansionCard, HStack } from '@navikt/ds-react';

import styles from './Delmal.module.css';
import { DelmalMeny } from './DelmalMeny';
import { FritekstSerializer } from './Sanity/FritekstSerializer';
import { ValgfeltSerializer } from './Sanity/ValgfeltSerializer';
import { Delmal as DelmalType, Fritekst, FritekstAvsnitt, Valg, Valgfelt } from './typer';
import { VariabelSerializer } from './VariabelSerializer';
import { useBrevFeilContext } from '../../context/BrevFeilContext';

interface Props {
    delmal: DelmalType;
    valgfelt: Partial<Record<Valgfelt['_id'], Valg>>;
    settValgfelt: React.Dispatch<SetStateAction<Record<Valgfelt['_id'], Valg>>>;
    variabler: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
    fritekst: Record<string, FritekstAvsnitt[] | undefined>;
    settFritekst: React.Dispatch<SetStateAction<Record<string, FritekstAvsnitt[] | undefined>>>;
    inkluderIBrev: boolean;
    settInkluderIBrev: (inkluderIBrev: boolean) => void;
    erEndringerIDelmal: boolean;
}

export function CustomComponents(
    valgfelt: Partial<Record<string, Valg>>,
    variabler: Partial<Record<string, string>>,
    fritekst: Record<string, FritekstAvsnitt[] | undefined>
) {
    return {
        types: {
            fritekst: (props: { value: Fritekst }) =>
                FritekstSerializer({ avsnitt: fritekst[props.value.parentId] }),
            valgfelt: ValgfeltSerializer(valgfelt, variabler, fritekst),
        },
        marks: {
            variabel: VariabelSerializer(variabler),
        },
    };
}

export const Delmal: React.FC<Props> = ({
    delmal,
    valgfelt,
    settValgfelt,
    variabler,
    settVariabler,
    fritekst,
    settFritekst,
    inkluderIBrev,
    settInkluderIBrev,
    erEndringerIDelmal,
}) => {
    const { delmalInneholderMangler } = useBrevFeilContext();
    return (
        <div className={styles.background}>
            <ExpansionCard
                aria-label={'Delmal'}
                size="small"
                defaultOpen={delmal.visningsdetaljer.skalAlltidMed}
            >
                <ExpansionCard.Header>
                    <HStack wrap={false} align={'center'} gap={'space-8'}>
                        {delmalInneholderMangler(delmal._id) && (
                            <ExclamationmarkTriangleIcon color={'red'} fontSize={'2rem'} />
                        )}
                        <ExpansionCard.Title size="small">
                            {delmal.visningsnavn}
                        </ExpansionCard.Title>
                    </HStack>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <div className={styles.container}>
                        {erEndringerIDelmal && !inkluderIBrev && (
                            <Alert variant={'warning'} size="small">
                                Du har gjort endringer i seksjonen. Huk av for &quot;Inkluder
                                seksjon i brev&quot; for at teksten skal bli med i brevet.
                            </Alert>
                        )}
                        <DelmalMeny
                            delmal={delmal}
                            valgfelt={valgfelt}
                            settValgfelt={settValgfelt}
                            variabler={variabler}
                            settVariabler={settVariabler}
                            fritekst={fritekst}
                            settFritekst={settFritekst}
                            inkluderIBrev={inkluderIBrev}
                            settInkluderIBrev={settInkluderIBrev}
                        />
                    </div>
                </ExpansionCard.Content>
            </ExpansionCard>
        </div>
    );
};
