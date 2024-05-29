import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { BodyShort, Button } from '@navikt/ds-react';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { VertikalSentrering } from '../../../App/utils/styling';
interface Props {
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    behandlingId: string;
}

interface PersonSøk {
    personIdent: string;
    behandlingId: string;
    navn: string;
}

export const SøkPerson: React.FC<Props> = ({ settValgteMottakere, behandlingId }) => {
    const { axiosRequest } = useApp();
    const [søkIdent, settSøkIdent] = useState('');
    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());

    useEffect(() => {
        if (søkIdent && søkIdent.length === 11) {
            axiosRequest<PersonSøk, { personIdent: string; behandlingId: string }>({
                method: 'POST',
                url: 'familie-klage/api/sok/person',
                data: {
                    personIdent: søkIdent,
                    behandlingId: behandlingId,
                },
            }).then((resp: Ressurs<PersonSøk>) => {
                settSøkRessurs(resp);
            });
        }
    }, [axiosRequest, søkIdent, behandlingId]);

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
            <DataViewer response={{ søkRessurs }}>
                {({ søkRessurs }) => {
                    return (
                        <Søkeresultat>
                            <div>
                                <BodyShort>{søkRessurs.navn}</BodyShort>
                                {søkRessurs.personIdent}
                            </div>
                            <VertikalSentrering>
                                <div>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={leggTilBrevmottaker(
                                            søkRessurs.personIdent,
                                            søkRessurs.navn
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
