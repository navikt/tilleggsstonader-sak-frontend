import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import { BodyLong, Select } from '@navikt/ds-react';

import { BrevmottakerSøk } from './BrevmottakerSøk';
import { SøkOrganisasjon } from './SøkOrganisasjon';
import styles from './SøkWrapper.module.css';
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
            <Select
                className={styles.søkTypeSelect}
                label={'Manuelt søk'}
                hideLabel
                value={søktype}
                onChange={(e) => settSøktype(e.target.value as ESøktype)}
            >
                <option>Velg</option>
                <option value={ESøktype.ORGANISASJON}>Organisasjon</option>
                <option value={ESøktype.PERSON}>Person</option>
            </Select>
            {søktype === ESøktype.ORGANISASJON && (
                <SøkOrganisasjon
                    valgteMottakere={valgteOrganisasjonMottakere}
                    settValgteMottakere={settValgteOrganisasjonMottakere}
                />
            )}
            {søktype === ESøktype.PERSON && (
                <BrevmottakerSøk settValgteMottakere={settValgtePersonMottakere} />
            )}
        </>
    );
};
