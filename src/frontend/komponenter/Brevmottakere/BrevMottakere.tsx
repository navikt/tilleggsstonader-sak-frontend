import React, { useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Tooltip, VStack } from '@navikt/ds-react';

import { EndreBrevmottakereModal } from './EndreBrevmottakereModal';
import { IBrevmottakere } from './typer';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { ContextBrevmottakere, useBrevmottakere } from '../../hooks/useBrevmottakere';
import { mapPersonopplysningerTilPersonopplysningerIBrevmottakere } from '../../Sider/Behandling/Brev/brevUtils';
import { leggTilKolonOgMellomrom, tilLitenSkriftMedStorForbokstav } from '../../utils/fomatering';
import DataViewer from '../DataViewer';

const Brevmottakere: React.FC<{
    mottakere: IBrevmottakere;
    kanEndreBrevmottakere: boolean;
    settVisBrevmottakereModal: (value: boolean) => void;
}> = ({ mottakere, kanEndreBrevmottakere, settVisBrevmottakereModal }) => {
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
                {kanEndreBrevmottakere && (
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
    context: ContextBrevmottakere;
    kanEndreBrevmottakere: boolean;
}> = ({ context, kanEndreBrevmottakere }) => {
    const { brevmottakere, hentBrevmottakere, lagreBrevmottakere } = useBrevmottakere(context);

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    const { personopplysninger } = usePersonopplysninger();

    return (
        <DataViewer response={{ brevmottakere }}>
            {({ brevmottakere }) => (
                <>
                    <Brevmottakere
                        mottakere={brevmottakere}
                        kanEndreBrevmottakere={kanEndreBrevmottakere}
                        settVisBrevmottakereModal={settVisBrevmottakereModal}
                    />
                    <EndreBrevmottakereModal
                        personopplysninger={mapPersonopplysningerTilPersonopplysningerIBrevmottakere(
                            personopplysninger
                        )}
                        mottakere={brevmottakere}
                        kallHentBrevmottakere={hentBrevmottakere}
                        lagreBrevmottakere={lagreBrevmottakere}
                        visBrevmottakereModal={visBrevmottakereModal}
                        settVisBrevmottakereModal={settVisBrevmottakereModal}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BrevMottakere;
