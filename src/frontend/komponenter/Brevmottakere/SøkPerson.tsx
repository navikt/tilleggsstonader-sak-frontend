import React, { Dispatch, SetStateAction, useState } from 'react';

import { BodyShort, Button } from '@navikt/ds-react';

import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { VertikalSentrering } from './VertikalSentrering';
import { usePersonsøk } from '../../hooks/useSøkPerson';
import DataViewer from '../DataViewer';

interface Props {
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    behandlingId: string;
}

export const SøkPerson: React.FC<Props> = ({ settValgteMottakere, behandlingId }) => {
    const [søkIdent, settSøkIdent] = useState('');

    const { søkeresultat } = usePersonsøk(søkIdent, behandlingId);

    const leggTilBrevmottaker = (personIdent: string, navn: string) => () => {
        settValgteMottakere((prevState) => [
            ...prevState,
            { navn, personIdent, mottakerRolle: EBrevmottakerRolle.VERGE },
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
            <DataViewer response={{ søkeresultat }}>
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
