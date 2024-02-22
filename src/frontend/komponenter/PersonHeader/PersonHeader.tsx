import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { BodyShort, CopyButton, HStack, Heading, Link } from '@navikt/ds-react';
import { ABorderStrong, ASpacing2, ASpacing4 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../context/AppContext';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { RessursStatus } from '../../typer/ressurs';
import { Søkeresultat } from '../PersonSøk';
import { Sticky } from '../Visningskomponenter/Sticky';

const Container = styled(Sticky)`
    display: flex;
    align-items: center;
    gap: ${ASpacing4};

    padding: ${ASpacing2} ${ASpacing4};

    border-bottom: 1px solid ${ABorderStrong};
    top: 48px;
`;

const PersonHeader: React.FC = () => {
    const { personopplysninger } = usePersonopplysninger();
    const { request } = useApp();
    const [fagsakPersonId, settFagsakPersonId] = useState<string>();

    const søkPerson = useCallback(() => {
        request<Søkeresultat, { personIdent: string }>(`/api/sak/sok/person`, 'POST', {
            personIdent: personopplysninger.personIdent,
        }).then((resultat) => {
            if (resultat.status === RessursStatus.SUKSESS) {
                settFagsakPersonId(resultat.data.fagsakPersonId);
            }
        });
    }, [personopplysninger.personIdent, request]);

    useEffect(søkPerson, [søkPerson]);

    return (
        <Container>
            <Heading size="xsmall">{personopplysninger.navn.visningsnavn}</Heading>
            <BodyShort>|</BodyShort>
            <HStack gap="2" align="center">
                {fagsakPersonId ? (
                    <Link href={`/person/${fagsakPersonId}`}>{personopplysninger.personIdent}</Link>
                ) : (
                    <BodyShort>{personopplysninger.personIdent}</BodyShort>
                )}
                <CopyButton copyText={personopplysninger.personIdent} size="small" />
            </HStack>
        </Container>
    );
};

export default PersonHeader;
