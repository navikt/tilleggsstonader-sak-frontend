import React, { useState } from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';

import { EndreBrevmottakereModal } from './EndreBrevmottakereModal';
import { Applikasjonskontekst, EBrevmottakerRolle, IBrevmottakere } from './typer';
import { useBrevmottakere } from '../../hooks/useBrevmottakere';
import { PersonopplysningerIBrevmottakere } from '../../Sider/Behandling/Brev/typer';
import { leggTilKolonOgMellomrom, tilLitenSkriftMedStorForbokstav } from '../../utils/fomatering';
import DataViewer from '../DataViewer';

const Grid = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const KompaktButton = styled(Button)`
    padding: 0;
`;

const Brevmottakere: React.FC<{
    mottakere: IBrevmottakere;
    behandlingErRedigerbar: boolean;
    settVisBrevmottakereModal: (value: boolean) => void;
}> = ({ mottakere, behandlingErRedigerbar, settVisBrevmottakereModal }) => {
    const utledNavnPåMottakere = (brevMottakere: IBrevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                (person) =>
                    `${leggTilKolonOgMellomrom(person?.navn)}${tilLitenSkriftMedStorForbokstav(person.mottakerRolle)}`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) =>
                    `${org.navnHosOrganisasjon} - ${org.organisasjonsnavn} (${org.organisasjonsnummer}): Fullmakt`
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
            <span>
                <Label>Brevmottaker:</Label>
                <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            </span>
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
    behandlingErRedigerbar: boolean;
    personopplysninger: PersonopplysningerIBrevmottakere;
}> = ({ behandlingId, applikasjonskontekst, behandlingErRedigerbar, personopplysninger }) => {
    const { brevmottakere, hentBrevmottakere } = useBrevmottakere(
        behandlingId,
        applikasjonskontekst
    );

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    return (
        <DataViewer response={{ brevmottakere }}>
            {({ brevmottakere }) => (
                <>
                    <Brevmottakere
                        mottakere={brevmottakere}
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        settVisBrevmottakereModal={settVisBrevmottakereModal}
                    />
                    <EndreBrevmottakereModal
                        behandlingId={behandlingId}
                        personopplysninger={personopplysninger}
                        mottakere={brevmottakere}
                        kallHentBrevmottakere={hentBrevmottakere}
                        visBrevmottakereModal={visBrevmottakereModal}
                        settVisBrevmottakereModal={settVisBrevmottakereModal}
                        applikasjonskontekst={applikasjonskontekst}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BrevMottakere;
