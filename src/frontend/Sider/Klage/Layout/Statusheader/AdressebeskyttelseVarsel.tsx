import React from 'react';

import { EtikettAdvarsel } from './Etikett';
import { Adressebeskyttelse } from '../../typer/personopplysningerFraKlage';

interface IProps {
    adressebeskyttelse: Adressebeskyttelse;
}

const AdressebeskyttelseVarsel: React.FC<IProps> = ({ adressebeskyttelse }) => {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND:
            return <EtikettAdvarsel>Kode 6 U</EtikettAdvarsel>;
        case Adressebeskyttelse.STRENGT_FORTROLIG:
            return <EtikettAdvarsel>Kode 6</EtikettAdvarsel>;
        case Adressebeskyttelse.FORTROLIG:
            return <EtikettAdvarsel>Kode 7</EtikettAdvarsel>;
        default:
            return null;
    }
};

export default AdressebeskyttelseVarsel;
