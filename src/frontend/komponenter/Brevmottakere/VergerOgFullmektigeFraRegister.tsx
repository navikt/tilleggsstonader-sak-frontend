import React, { Dispatch, FC, SetStateAction } from 'react';

import { BodyLong, BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { fullmektigDtoTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import { Fødselsnummer } from './Fødselsnummer';
import { IBrevmottaker } from './typer';
import styles from './VergerOgFullmektigeFraRegister.module.css';
import { VertikalSentrering } from './VertikalSentrering';
import { useHentFullmektige } from '../../hooks/useHentFullmektige';
import { Vergemål } from '../../Sider/Klage/typer/personopplysningerFraKlage';

interface Props {
    valgteMottakere: IBrevmottaker[];
    personIdent: string;
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: Vergemål[];
}

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
                        <div className={styles.mottakerBoks} key={mottaker.navn + index}>
                            <div className={styles.kolonner}>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <Fødselsnummer fødselsnummer={mottaker.personIdent} />
                            </div>
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
                        </div>
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
