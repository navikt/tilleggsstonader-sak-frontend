import React, { Dispatch, FC, SetStateAction } from 'react';

import styled from 'styled-components';

import { Button, BodyShort, BodyLong } from '@navikt/ds-react';

import { fullmaktTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import { Fødselsnummer } from './Fødselsnummer';
import { IBrevmottaker } from './typer';
import { VertikalSentrering } from './VertikalSentrering';
import { Fullmakt, Vergemål } from '../../Sider/Klage/typer/personopplysningerFraKlage';

interface Props {
    valgteMottakere: IBrevmottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: Vergemål[];
    fullmakter: Fullmakt[];
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
    settValgteMottakere,
    verger,
    fullmakter,
}) => {
    const muligeMottakere = [
        ...verger.map(vergemålTilBrevmottaker),
        ...fullmakter.map(fullmaktTilBrevMottaker),
    ];

    const settMottaker = (mottaker: IBrevmottaker) => () => {
        settValgteMottakere((prevState) => {
            return [...prevState, mottaker];
        });
    };

    return (
        <>
            <BodyLong size="large" spacing>
                Verge/Fullmektig fra register
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
        </>
    );
};
