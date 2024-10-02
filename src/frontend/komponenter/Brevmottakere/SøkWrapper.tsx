import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import styled from 'styled-components';

import { BodyLong, Select } from '@navikt/ds-react';

import { SøkOrganisasjon } from './SøkOrganisasjon';
import { SøkPerson } from './SøkPerson';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';

interface Props {
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

enum ESøktype {
    ORGANISASJON = 'ORGANISASJON',
    PERSON = 'PERSON',
}

const SøkTypeSelect = styled(Select)`
    width: 200px;
    margin-bottom: 1rem;
`;

export const SøkWrapper: FC<Props> = ({
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const [søktype, settSøktype] = useState<ESøktype>();

    return (
        <>
            <BodyLong size="large" spacing>
                Manuelt søk
            </BodyLong>
            <SøkTypeSelect
                label={'Manuelt søk'}
                hideLabel
                value={søktype}
                onChange={(e) => settSøktype(e.target.value as ESøktype)}
            >
                <option>Velg</option>
                <option value={ESøktype.ORGANISASJON}>Organisasjon</option>
                <option value={ESøktype.PERSON}>Person</option>
            </SøkTypeSelect>
            {søktype === ESøktype.ORGANISASJON && (
                <SøkOrganisasjon
                    valgteMottakere={valgteOrganisasjonMottakere}
                    settValgteMottakere={settValgteOrganisasjonMottakere}
                />
            )}
            {søktype === ESøktype.PERSON && (
                <SøkPerson settValgteMottakere={settValgtePersonMottakere} />
            )}
        </>
    );
};
