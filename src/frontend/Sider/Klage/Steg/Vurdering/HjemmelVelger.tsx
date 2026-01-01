import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { UNSAFE_Combobox } from '@navikt/ds-react';

import { alleHjemlerTilVisningstekst, Hjemmel } from './hjemmel';
import styles from './HjemmelVelger.module.css';
import { Vurderingsfelter } from './vurderingsfelter';

interface IHjemmel {
    settHjemler: Dispatch<SetStateAction<Vurderingsfelter>>;
    hjemler?: Hjemmel[];
    endring: (komponentId: string) => void;
}

const hjemlerTilOptions = (hjemler: Hjemmel[] | undefined) =>
    hjemler?.map((hjemmel) => ({
        value: hjemmel,
        label: alleHjemlerTilVisningstekst[hjemmel as Hjemmel],
    })) ?? [];

export const HjemmelVelger: React.FC<IHjemmel> = ({ settHjemler, hjemler, endring }) => {
    const options = hjemlerTilOptions(Object.keys(alleHjemlerTilVisningstekst) as Hjemmel[]);
    const selectedOptions = hjemlerTilOptions(hjemler);
    const onToggleSelected = (option: string, isSelected: boolean) => {
        endring('hjemmel');
        settHjemler((prevState) => {
            if (isSelected) {
                return {
                    ...prevState,
                    hjemler: [...(prevState.hjemler || []), option as Hjemmel],
                };
            } else {
                return {
                    ...prevState,
                    hjemler: (prevState.hjemler || []).filter((hjemmel) => hjemmel !== option),
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
