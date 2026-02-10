import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { UNSAFE_Combobox } from '@navikt/ds-react';

import { Hjemmel } from './hjemmel';
import styles from './HjemmelVelger.module.css';
import { Vurderingsfelter } from './vurderingsfelter';

interface IHjemmel {
    settHjemler: Dispatch<SetStateAction<Vurderingsfelter>>;
    valgteHjemler?: Hjemmel[];
    tilgjengeligeHjemler: Hjemmel[];
    endring: (komponentId: string) => void;
}

const hjemlerTilOptions = (hjemler: Hjemmel[] | undefined) =>
    hjemler?.map((hjemmel) => ({
        value: hjemmel.hjemmel,
        label: hjemmel.visningstekst,
    })) ?? [];

const finnHjemmel = (tilgengligeHjemler: Hjemmel[], hjemmelString: string) =>
    tilgengligeHjemler.find((hjemmel) => hjemmel.hjemmel === hjemmelString);

export const HjemmelVelger: React.FC<IHjemmel> = ({
    settHjemler,
    valgteHjemler,
    tilgjengeligeHjemler,
    endring,
}) => {
    const options = hjemlerTilOptions(tilgjengeligeHjemler);
    const selectedOptions = hjemlerTilOptions(valgteHjemler);
    const onToggleSelected = (option: string, isSelected: boolean) => {
        endring('hjemmel');
        const hjemmel = finnHjemmel(tilgjengeligeHjemler, option);
        settHjemler((prevState) => {
            if (isSelected) {
                if (!hjemmel) {
                    return prevState;
                }
                return {
                    ...prevState,
                    hjemler: [...(prevState.hjemler || []), hjemmel],
                };
            } else {
                return {
                    ...prevState,
                    hjemler: (prevState.hjemler || []).filter(
                        (hjemmel) => hjemmel.hjemmel !== option
                    ),
                };
            }
        });
    };

    return (
        <div className={styles.hjemmel}>
            <div className={styles.hjemmelInnhold}>
                <UNSAFE_Combobox
                    label="Hjemler"
                    description={'Velg inntil 2 hjemler som klagen kan knyttes til'}
                    size="medium"
                    options={options}
                    selectedOptions={selectedOptions}
                    onToggleSelected={onToggleSelected}
                    isMultiSelect={true}
                    maxSelected={2}
                />
            </div>
        </div>
    );
};
