import React, { Dispatch, FC, SetStateAction } from 'react';

import styled from 'styled-components';

import { BodyLong, BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { fullmektigDtoTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import { Fødselsnummer } from './Fødselsnummer';
import { IBrevmottaker } from './typer';
import { VertikalSentrering } from './VertikalSentrering';
import { useHentFullmektige } from '../../hooks/useHentFullmektige';
import { Vergemål } from '../../Sider/Klage/typer/personopplysningerFraKlage';

interface Props {
    valgteMottakere: IBrevmottaker[];
    personIdent: string;
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: Vergemål[];
}

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Kolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

export const VergerOgFullmektigeFraRegister: FC<Props> = ({
    valgteMottakere,
    personIdent,
    settValgteMottakere,
    verger,
}) => {
    const { fullmektige, feilmeldingFraHentFullmektige } = useHentFullmektige(personIdent);

    const muligeMottakere = [
        ...(fullmektige?.map(fullmektigDtoTilBrevMottaker) ?? []),
        ...verger.map(vergemålTilBrevmottaker),
    ];

    const settMottaker = (mottaker: IBrevmottaker) => () => {
        settValgteMottakere((prevState) => {
            return [...prevState, mottaker];
        });
    };

    return (
        <>
            <BodyLong size="large" spacing>
                Verge/fullmektig fra register
            </BodyLong>
            {muligeMottakere.length ? (
                muligeMottakere.map((mottaker, index) => {
                    const mottakerValgt = !!valgteMottakere.find(
                        (valgtMottaker) => valgtMottaker.personIdent === mottaker.personIdent
                    );
                    return (
                        <StyledMottakerBoks key={mottaker.navn + index}>
                            <Kolonner>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <Fødselsnummer fødselsnummer={mottaker.personIdent} />
                            </Kolonner>
                            {!mottakerValgt && (
                                <VertikalSentrering>
                                    <div>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={settMottaker(mottaker)}
                                        >
                                            Legg til
                                        </Button>
                                    </div>
                                </VertikalSentrering>
                            )}
                        </StyledMottakerBoks>
                    );
                })
            ) : (
                <BodyShort>Ingen verge/fullmektig i register</BodyShort>
            )}
            {feilmeldingFraHentFullmektige && (
                <ErrorMessage>
                    Henting av fullmakter feilet: {feilmeldingFraHentFullmektige}
                </ErrorMessage>
            )}
        </>
    );
};
