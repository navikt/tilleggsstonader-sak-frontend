import React, { useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Tooltip, VStack } from '@navikt/ds-react';

import { EndreBrevmottakereModal } from './EndreBrevmottakereModal';
import { Applikasjonskontekst, IBrevmottakere } from './typer';
import { useBrevmottakere } from '../../hooks/useBrevmottakere';
import { PersonopplysningerIBrevmottakere } from '../../Sider/Behandling/Brev/typer';
import { leggTilKolonOgMellomrom, tilLitenSkriftMedStorForbokstav } from '../../utils/fomatering';
import DataViewer from '../DataViewer';

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

    return (
        <VStack gap="2">
            <HStack align="center">
                <Label size="small">Brevmottakere</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <Button
                            variant="tertiary"
                            onClick={() => settVisBrevmottakereModal(true)}
                            size="xsmall"
                            icon={<PencilIcon />}
                        >
                            Endre
                        </Button>
                    </Tooltip>
                )}
            </HStack>
            {navn.map((navn, index) => (
                <BodyShort size="small" key={navn + index}>
                    {navn}
                </BodyShort>
            ))}
        </VStack>
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
