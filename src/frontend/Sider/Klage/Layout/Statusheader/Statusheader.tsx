import React, { FC } from 'react';
import { Personopplysninger } from '../../typer/personopplysninger';
import styled from 'styled-components';
import { erBehandlingRedigerbar, Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { Hamburgermeny } from './Hamburgermeny';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './StatusElementer';
import { Label } from '@navikt/ds-react';
import PersonStatusVarsel from './PersonStatusVarsel';
import AdressebeskyttelseVarsel from './AdressebeskyttelseVarsel';
import { EtikettFokus } from './Etikett';
import Visittkort from '../../familie-felles-frontend/familie-visittkort';
import { Sticky } from '../../../../komponenter/Visningskomponenter/Sticky';
import { erEtterDagensDato } from '../../../../utils/dato';

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

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

export const Statusheader: FC<{
    personopplysninger: Personopplysninger;
    behandling: Klagebehandling;
}> = ({
    personopplysninger,
    behandling
}) => {
    const {
        personIdent,
        kjønn,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        fullmakt,
        vergemål,
    } = personopplysninger;
    return (
        <StatusheaderWrapper>
            <Visittkort
                alder={20}
                ident={personIdent}
                kjønn={kjønn}
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
                {fullmakt.some((f) => erEtterDagensDato(f.gyldigTilOgMed)) && (
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
                    <AlleStatuser behandling={behandling}/>
                    <StatuserLitenSkjerm>
                        <StatusMeny behandling={behandling}/>
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && <StyledHamburgermeny />}
        </StatusheaderWrapper>
    );
};
