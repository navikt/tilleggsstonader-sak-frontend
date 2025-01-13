import React, { FC } from 'react';

import styled from 'styled-components';

import { Label } from '@navikt/ds-react';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';

import AdressebeskyttelseVarsel from './AdressebeskyttelseVarsel';
import { EtikettFokus } from './Etikett';
import { HamburgermenyKlage } from './HamburgermenyKlage';
import PersonStatusVarsel from './PersonStatusVarsel';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './StatusElementer';
import { Sticky } from '../../../../komponenter/Visningskomponenter/Sticky';
import Visittkort from '../../familie-felles-frontend/familie-visittkort';
import {
    erBehandlingRedigerbar,
    Klagebehandling,
} from '../../typer/klagebehandling/klagebehandling';
import { PersonopplysningerFraKlage } from '../../typer/personopplysningerFraKlage';

const Visningsnavn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const StatusheaderWrapper = styled(Sticky)`
    display: flex;

    border-bottom: 1px solid ${ABorderStrong};
    z-index: 22;
    top: 47px;

    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

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
        <StatusheaderWrapper>
            <Visittkort
                alder={20}
                ident={personIdent}
                navn={
                    <Visningsnavn>
                        <Label size={'small'} as={'p'}>
                            {navn}
                        </Label>
                    </Visningsnavn>
                }
            >
                {folkeregisterpersonstatus && (
                    <ElementWrapper>
                        <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                    </ElementWrapper>
                )}
                {adressebeskyttelse && (
                    <ElementWrapper>
                        <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
                    </ElementWrapper>
                )}
                {egenAnsatt && (
                    <ElementWrapper>
                        <EtikettFokus>Egen ansatt</EtikettFokus>
                    </ElementWrapper>
                )}
                {harFullmektig && (
                    <ElementWrapper>
                        <EtikettFokus>Fullmakt</EtikettFokus>
                    </ElementWrapper>
                )}
                {vergemål.length > 0 && (
                    <ElementWrapper>
                        <EtikettFokus>Verge</EtikettFokus>
                    </ElementWrapper>
                )}
            </Visittkort>

            {behandling && (
                <>
                    <AlleStatuser behandling={behandling} />
                    <StatuserLitenSkjerm>
                        <StatusMeny behandling={behandling} />
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && <HamburgermenyKlage />}
        </StatusheaderWrapper>
    );
};
