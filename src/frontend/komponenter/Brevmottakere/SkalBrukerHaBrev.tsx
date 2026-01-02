import React, { Dispatch, FC, SetStateAction } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { BodyLong, Radio, RadioGroup } from '@navikt/ds-react';

import styles from './SkalBrukerHaBrev.module.css';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { PersonopplysningerIBrevmottakere } from '../Brev/typer';

interface Props {
    valgteBrevmottakere: IBrevmottaker[];
    settValgtBrevMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    personopplysninger: PersonopplysningerIBrevmottakere;
}

export const SkalBrukerHaBrev: FC<Props> = ({
    valgteBrevmottakere,
    settValgtBrevMottakere,
    personopplysninger,
}) => {
    const brukerSkalHaBrev = valgteBrevmottakere.some(
        (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    const toggleBrukerSkalHaBrev = () => {
        settValgtBrevMottakere((mottakere) => {
            const brukerErIListe = mottakere.some(
                (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
            );
            if (brukerErIListe) {
                return mottakere.filter(
                    (mottaker) => mottaker.mottakerRolle !== EBrevmottakerRolle.BRUKER
                );
            } else {
                return [
                    {
                        id: uuidv4(),
                        mottakerRolle: EBrevmottakerRolle.BRUKER,
                        personIdent: personopplysninger.personIdent,
                        navn: personopplysninger.navn,
                    },
                    ...mottakere,
                ];
            }
        });
    };

    return (
        <>
            <BodyLong size="large" spacing>
                Skal bruker motta brevet?
            </BodyLong>
            <RadioGroup
                className={styles.radioGruppe}
                legend={'Skal bruker motta brevet?'}
                hideLegend
                value={brukerSkalHaBrev ? 'Ja' : 'Nei'}
            >
                <Radio value={'Ja'} name={'brukerHaBrevRadio'} onChange={toggleBrukerSkalHaBrev}>
                    Ja
                </Radio>
                <Radio value={'Nei'} name={'brukerHaBrevRadio'} onChange={toggleBrukerSkalHaBrev}>
                    Nei
                </Radio>
            </RadioGroup>
        </>
    );
};
