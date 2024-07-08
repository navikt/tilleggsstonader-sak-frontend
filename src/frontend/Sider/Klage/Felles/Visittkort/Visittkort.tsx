import React, { FC } from 'react';
import { Personopplysninger } from '../../App/typer/personopplysninger';
import styled from 'styled-components';
import { erBehandlingRedigerbar, Klagebehandling } from '../../App/typer/klagebehandling/klagebehandling';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { Hamburgermeny } from './Hamburgermeny';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './Status/StatusElementer';
import { Label } from '@navikt/ds-react';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from '../Varsel/Etikett';
import { erEtterDagensDato } from '../../utils/dato';
import Visittkort from '../../familie-felles-frontend/familie-visittkort';
import { Sticky } from '../../../../komponenter/Visningskomponenter/Sticky';

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

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

const VisittkortComponent: FC<{
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
