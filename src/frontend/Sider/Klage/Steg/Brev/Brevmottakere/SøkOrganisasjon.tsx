import React, { Dispatch, SetStateAction, useState } from 'react';
import DataViewer from '../../../../../komponenter/DataViewer';
import { IOrganisasjonMottaker } from './typer';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { useOrganisasjonssøk } from '../../../../../hooks/useSøkOrganisasjon';

interface Props {
    valgteMottakere: IOrganisasjonMottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

export const SøkOrganisasjon: React.FC<Props> = ({ settValgteMottakere }) => {
    const [organisasjonsnummer, settOrganisasjonsnummer] = useState('');
    const [navnHosOrganisasjon, settNavnHosOrganisasjon] = useState('');

    const [feil, settFeil] = useState('');

    const { søkeresultat } = useOrganisasjonssøk(organisasjonsnummer);

    const leggTilOrganisasjon = (organisasjonsnummer: string, organisasjonsnavn: string) => () => {
        if (!navnHosOrganisasjon) {
            settFeil('Oppgi kontaktperson hos organisasjonen');
            return;
        }
        settFeil('');
        settValgteMottakere([
            {
                organisasjonsnummer,
                organisasjonsnavn,
                navnHosOrganisasjon,
            },
        ]);
    };

    return (
        <>
            <Søkefelt
                label={'Organisasjonsnummer'}
                htmlSize={26}
                placeholder={'Søk'}
                value={organisasjonsnummer}
                onChange={(e) => settOrganisasjonsnummer(e.target.value)}
            />
            <DataViewer response={{ søkeresultat }}>
                {({ søkeresultat }) => {
                    return (
                        <Søkeresultat>
                            <div>
                                <BodyShort>{søkeresultat.navn}</BodyShort>
                                {søkeresultat.organisasjonsnummer}
                            </div>
                            <Button
                                variant={'secondary'}
                                onClick={leggTilOrganisasjon(
                                    søkeresultat.organisasjonsnummer,
                                    søkeresultat.navn
                                )}
                            >
                                Legg til
                            </Button>
                            <TextField
                                htmlSize={25}
                                label={'Ved'}
                                placeholder={'Personen brevet skal til'}
                                value={navnHosOrganisasjon}
                                onChange={(e) => settNavnHosOrganisasjon(e.target.value)}
                                error={feil}
                            />
                        </Søkeresultat>
                    );
                }}
            </DataViewer>
        </>
    );
};
