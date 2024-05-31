import React from 'react';
import { Folkeregisterpersonstatus } from '../../App/typer/personopplysninger';
import { EtikettAdvarsel } from './Etikett';

interface IProps {
    folkeregisterpersonstatus: Folkeregisterpersonstatus;
}

const PersonStatusVarsel: React.FC<IProps> = ({ folkeregisterpersonstatus }) => {
    switch (folkeregisterpersonstatus) {
        case Folkeregisterpersonstatus.DØD:
            return <EtikettAdvarsel>Død</EtikettAdvarsel>;
        case Folkeregisterpersonstatus.FORSVUNNET:
            return <EtikettAdvarsel>Forsvunnet</EtikettAdvarsel>;
        case Folkeregisterpersonstatus.UTFLYTTET:
            return <EtikettAdvarsel>Utflyttet</EtikettAdvarsel>;
        default:
            return null;
    }
};

export default PersonStatusVarsel;
