import React, { FC } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Klagebehandling } from '../../App/typer/fagsak';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { Sticky } from '../Visningskomponenter/Sticky';
import { Hamburgermeny } from './Hamburgermeny';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './Status/StatusElementer';
import { Label } from '@navikt/ds-react';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus, EtikettSuksess } from '../Varsel/Etikett';
import { stønadstypeTilTekstKort } from '../../App/typer/stønadstype';
import { erEtterDagensDato } from '../../utils/dato';
import Visittkort from '../../familie-felles-frontend/familie-visittkort';

const Visningsnavn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const VisittkortWrapper = styled(Sticky)`
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

const TagsKnyttetTilBehandling = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
`;

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

const VisittkortComponent: FC<{
    personopplysninger: IPersonopplysninger;
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
        <VisittkortWrapper>
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

                <TagsKnyttetTilBehandling>
                    <EtikettSuksess>
                        {stønadstypeTilTekstKort[behandling.stønadstype]}
                    </EtikettSuksess>
                </TagsKnyttetTilBehandling>
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
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
