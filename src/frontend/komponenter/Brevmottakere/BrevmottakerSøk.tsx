import React, { Dispatch, SetStateAction, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { BodyShort, Button } from '@navikt/ds-react';

import { Søkefelt } from './Søkefelt';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { VertikalSentrering } from './VertikalSentrering';
import { usePersonsøk } from '../../hooks/useSøkPerson';
import DataViewer from '../DataViewer';
import { Søkeresultat } from './Søkeresultat';

interface Props {
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
}

export const BrevmottakerSøk: React.FC<Props> = ({ settValgteMottakere }) => {
    const [søkIdent, settSøkIdent] = useState('');

    const { søkeresultat } = usePersonsøk(søkIdent);

    const leggTilBrevmottaker = (personIdent: string, navn: string) => () => {
        settValgteMottakere((prevState) => [
            ...prevState,
            {
                id: uuidv4(),
                personIdent: personIdent,
                navn: navn,
                mottakerRolle: EBrevmottakerRolle.VERGE,
            },
        ]);
    };

    return (
        <>
            <Søkefelt
                label={'Personident'}
                htmlSize={26}
                placeholder={'Personen som skal ha brevet'}
                value={søkIdent}
                onChange={(e) => settSøkIdent(e.target.value)}
            />
            <DataViewer type={'søkeresultat'} response={{ søkeresultat }}>
                {({ søkeresultat }) => {
                    return (
                        <Søkeresultat>
                            <div>
                                <BodyShort>{søkeresultat.navn}</BodyShort>
                                {søkeresultat.ident}
                            </div>
                            <VertikalSentrering>
                                <div>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={leggTilBrevmottaker(
                                            søkeresultat.ident,
                                            søkeresultat.navn
                                        )}
                                    >
                                        Legg til
                                    </Button>
                                </div>
                            </VertikalSentrering>
                        </Søkeresultat>
                    );
                }}
            </DataViewer>
        </>
    );
};
