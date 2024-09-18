import React, { Dispatch, FC, SetStateAction } from 'react';

import styled from 'styled-components';

import { BodyLong, BodyShort } from '@navikt/ds-react';

import { Fødselsnummer } from './Fødselsnummer';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';
import { SøppelbøtteKnapp } from '../Knapper/SøppelbøtteKnapp';

interface Props {
    valgtePersonMottakere: IBrevmottaker[];
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Flexboks = styled.div`
    display: flex;
    flex-direction: column;
`;

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
                <StyledMottakerBoks key={mottaker.navn + index}>
                    <Flexboks>
                        <BodyShort>
                            {`${mottaker?.navn || ''} (${mottaker.mottakerRolle.toLowerCase()})`}
                            <Fødselsnummer fødselsnummer={mottaker.personIdent} />
                        </BodyShort>
                    </Flexboks>
                    <SøppelbøtteKnapp onClick={fjernPersonMottaker(mottaker.personIdent)} />
                </StyledMottakerBoks>
            ))}
            {valgteOrganisasjonMottakere.map((mottaker, index) => (
                <StyledMottakerBoks key={mottaker.navnHosOrganisasjon + index}>
                    <div>
                        <BodyShort>{`${mottaker.navnHosOrganisasjon}`}</BodyShort>
                        <BodyShort>
                            {`Organisasjonsnummer: ${mottaker.organisasjonsnummer}`}
                        </BodyShort>
                    </div>
                    <SøppelbøtteKnapp
                        onClick={fjernOrganisasjonMottaker(mottaker.organisasjonsnummer)}
                    />
                </StyledMottakerBoks>
            ))}
        </>
    );
};
