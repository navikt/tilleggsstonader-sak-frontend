import React, { FC } from 'react';

import { Label } from '@navikt/ds-react';

import AdressebeskyttelseVarsel from './AdressebeskyttelseVarsel';
import { EtikettFokus } from './Etikett';
import { HamburgermenyKlage } from './HamburgermenyKlage';
import PersonStatusVarsel from './PersonStatusVarsel';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './StatusElementer';
import styles from './Statusheader.module.css';
import { Sticky } from '../../../../komponenter/Visningskomponenter/Sticky';
import Visittkort from '../../familie-felles-frontend/familie-visittkort';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { PersonopplysningerFraKlage } from '../../typer/personopplysningerFraKlage';

export const Statusheader: FC<{
    personopplysninger: PersonopplysningerFraKlage;
    behandling: Klagebehandling;
}> = ({ personopplysninger, behandling }) => {
    const {
        personIdent,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        harFullmektig,
        vergemål,
    } = personopplysninger;
    return (
        <Sticky className={styles.wrapper}>
            <Visittkort
                alder={20}
                ident={personIdent}
                navn={
                    <div className={styles.visningsnavn}>
                        <Label size={'small'} as={'p'}>
                            {navn}
                        </Label>
                    </div>
                }
            >
                {folkeregisterpersonstatus && (
                    <div className={styles.element}>
                        <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                    </div>
                )}
                {adressebeskyttelse && (
                    <div className={styles.element}>
                        <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
                    </div>
                )}
                {egenAnsatt && (
                    <div className={styles.element}>
                        <EtikettFokus>Egen ansatt</EtikettFokus>
                    </div>
                )}
                {harFullmektig && (
                    <div className={styles.element}>
                        <EtikettFokus>Fullmakt</EtikettFokus>
                    </div>
                )}
                {vergemål.length > 0 && (
                    <div className={styles.element}>
                        <EtikettFokus>Verge</EtikettFokus>
                    </div>
                )}
            </Visittkort>

            <div className={styles.rightContent}>
                {behandling && (
                    <>
                        <AlleStatuser behandling={behandling} />
                        <StatuserLitenSkjerm>
                            <StatusMeny behandling={behandling} />
                        </StatuserLitenSkjerm>
                    </>
                )}
                {<HamburgermenyKlage behandling={behandling} />}
            </div>
        </Sticky>
    );
};
