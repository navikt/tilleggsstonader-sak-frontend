import React from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';

import { EndreBrevmottakereModal } from './EndreBrevmottakereModal';
import { EBrevmottakerRolle, IBrevmottakere } from './typer';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { Applikasjonskontekst, useBrevmottakere } from '../../hooks/useBrevmottakere';
import { useKlageApp } from '../../Sider/Klage/context/KlageAppContext';
import DataViewer from '../DataViewer';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 9rem 23rem 16rem;
`;

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 26rem 12rem;
`;

const KompaktButton = styled(Button)`
    padding: 0;
    justify-content: right;

    .navds-button__inner {
        margin: 0;
    }
`;

const Brevmottakere: React.FC<{
    mottakere: IBrevmottakere;
}> = ({ mottakere }) => {
    const { settVisBrevmottakereModal } = useKlageApp();
    //TODO FIKSE DETTE behandlingErRedigerbar for SAK-frontend
    // const { behandlingErRedigerbar } = useKlagebehandling();
    const behandlingErRedigerbar = true;
    const utledNavnPåMottakere = (brevMottakere: IBrevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                (person) => `${formatterBeskrivelseAvBrevmottakersRolle(person.mottakerRolle)}`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) =>
                    `${org.navnHosOrganisasjon} - ${org.organisasjonsnavn} (${org.organisasjonsnummer})`
            ),
        ];
    };

    const formatterBeskrivelseAvBrevmottakersRolle = (mottakerRolle: string): string => {
        const rolleLowerCase = mottakerRolle.toLowerCase();
        const firstLetterUpperCase = mottakerRolle.charAt(0).toUpperCase();
        return firstLetterUpperCase + rolleLowerCase.slice(1);
    };

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const brukerErBrevmottaker = mottakere.personer.find(
        (person) => person.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    return flereBrevmottakereErValgt || !brukerErBrevmottaker ? (
        <Alert variant={'info'}>
            <InfoHeader>
                <Label>Brevmottakere:</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <KompaktButton
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/endre brevmottakere
                        </KompaktButton>
                    </Tooltip>
                )}
            </InfoHeader>
            <ul>
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    ) : (
        <Grid>
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            {behandlingErRedigerbar && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <KompaktButton
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                    >
                        Legg til/endre brevmottakere
                    </KompaktButton>
                </Tooltip>
            )}
        </Grid>
    );
};
const BrevMottakere: React.FC<{
    behandlingId: string;
    applikasjonskontekst: Applikasjonskontekst;
}> = ({ behandlingId, applikasjonskontekst }) => {
    const { personopplysninger } = usePersonopplysninger();

    const { brevmottakere, hentBrevmottakere } = useBrevmottakere(
        behandlingId,
        applikasjonskontekst
    );

    return (
        <DataViewer response={{ brevmottakere }}>
            {({ brevmottakere }) => (
                <>
                    <Brevmottakere mottakere={brevmottakere} />
                    <EndreBrevmottakereModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        mottakere={brevmottakere}
                        kallHentBrevmottakere={hentBrevmottakere}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BrevMottakere;
