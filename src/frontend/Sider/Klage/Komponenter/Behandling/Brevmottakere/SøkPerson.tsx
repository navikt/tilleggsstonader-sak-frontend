import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useKlageApp } from '../../../App/context/KlageAppContext';
import { byggTomRessurs, Ressurs } from '../../../../../typer/ressurs';
import DataViewer from '../../../../../komponenter/DataViewer';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { BodyShort, Button } from '@navikt/ds-react';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { VertikalSentrering } from '../../../utils/styling';
interface Props {
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    behandlingId: string;
}

interface PersonSøk {
    ident: string;
    behandlingId: string;
    navn: string;
}

export const SøkPerson: React.FC<Props> = ({ settValgteMottakere, behandlingId }) => {
    const { axiosRequest } = useKlageApp();
    const [søkIdent, settSøkIdent] = useState('');
    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());

    useEffect(() => {
        if (søkIdent && søkIdent.length === 11) {
            axiosRequest<PersonSøk, { personIdent: string; behandlingId: string }>({
                method: 'POST',
                url: 'api/sak/brevmottakere/person',
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
                                {søkRessurs.ident}
                            </div>
                            <VertikalSentrering>
                                <div>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={leggTilBrevmottaker(
                                            søkRessurs.ident,
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
