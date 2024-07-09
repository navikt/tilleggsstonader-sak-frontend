import React from 'react';
import styled from 'styled-components';
import { useKlageApp } from '../../../context/KlageAppContext';
import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';
import { EBrevmottakerRolle, IBrevmottakere } from './typer';
import { useKlagebehandling } from '../../../context/KlagebehandlingContext';
import { EndreBrevmottakereModal } from './EndreBrevmottakereModal';
import DataViewer from '../../../../../komponenter/DataViewer';
import { useBrevmottakere } from '../../../hooks/useBrevmottakere';

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
    const { behandlingErRedigerbar } = useKlagebehandling();
    const utledNavnPåMottakere = (brevMottakere: IBrevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                (person) => `${person.navn} (${person.mottakerRolle.toLowerCase()})`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) =>
                    `${org.navnHosOrganisasjon} - ${org.organisasjonsnavn} (${org.organisasjonsnummer})`
            ),
        ];
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

const BrevMottakere: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { personopplysningerResponse } = useKlagebehandling();

    const { brevmottakere, hentBrevmottakere } = useBrevmottakere(behandlingId);

    return (
        <DataViewer response={{ brevmottakere, personopplysningerResponse }}>
            {({ brevmottakere, personopplysningerResponse }) => (
                <>
                    <Brevmottakere mottakere={brevmottakere} />
                    <EndreBrevmottakereModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysningerResponse}
                        mottakere={brevmottakere}
                        kallHentBrevmottakere={hentBrevmottakere}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BrevMottakere;
