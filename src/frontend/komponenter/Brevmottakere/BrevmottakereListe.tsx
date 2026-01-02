import React, { Dispatch, FC, SetStateAction } from 'react';

import { BodyLong, BodyShort } from '@navikt/ds-react';

import styles from './BrevmottakereListe.module.css';
import { Fødselsnummer } from './Fødselsnummer';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';
import { SøppelbøtteKnapp } from '../Knapper/SøppelbøtteKnapp';

interface Props {
    valgtePersonMottakere: IBrevmottaker[];
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

export const BrevmottakereListe: FC<Props> = ({
    valgtePersonMottakere,
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const fjernPersonMottaker = (personIdent: string) => () => {
        settValgtePersonMottakere((prevState) =>
            prevState.filter((mottaker) => mottaker.personIdent !== personIdent)
        );
    };
    const fjernOrganisasjonMottaker = (organisasjonsnummer: string) => () => {
        settValgteOrganisasjonMottakere((prevState) =>
            prevState.filter((mottaker) => mottaker.organisasjonsnummer !== organisasjonsnummer)
        );
    };

    return (
        <>
            <BodyLong size="large" spacing>
                Brevmottakere
            </BodyLong>
            {valgtePersonMottakere.map((mottaker, index) => (
                <div className={styles.mottakerBoks} key={mottaker.navn + index}>
                    <div className={styles.flexboks}>
                        <BodyShort>
                            {`${mottaker?.navn || ''} (${mottaker.mottakerRolle.toLowerCase()})`}
                            <Fødselsnummer fødselsnummer={mottaker.personIdent} />
                        </BodyShort>
                    </div>
                    <SøppelbøtteKnapp onClick={fjernPersonMottaker(mottaker.personIdent)} />
                </div>
            ))}
            {valgteOrganisasjonMottakere.map((mottaker, index) => (
                <div className={styles.mottakerBoks} key={mottaker.navnHosOrganisasjon + index}>
                    <div>
                        <BodyShort>{`${mottaker.navnHosOrganisasjon}`}</BodyShort>
                        <BodyShort>
                            {`Organisasjonsnummer: ${mottaker.organisasjonsnummer}`}
                        </BodyShort>
                    </div>
                    <SøppelbøtteKnapp
                        onClick={fjernOrganisasjonMottaker(mottaker.organisasjonsnummer)}
                    />
                </div>
            ))}
        </>
    );
};
