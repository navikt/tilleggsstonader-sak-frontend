import React, { useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Tooltip, VStack } from '@navikt/ds-react';

import { EndreBrevmottakereModal } from './EndreBrevmottakereModal';
import { IBrevmottakere } from './typer';
import { ContextBrevmottakere, useBrevmottakere } from '../../hooks/useBrevmottakere';
import { leggTilKolonOgMellomrom, tilLitenSkriftMedStorForbokstav } from '../../utils/fomatering';
import { PersonopplysningerIBrevmottakere } from '../Brev/typer';
import DataViewer from '../DataViewer';

export const BrevMottakere: React.FC<{
    context: ContextBrevmottakere;
    kanEndreBrevmottakere: boolean;
    personopplysninger: PersonopplysningerIBrevmottakere;
}> = ({ context, kanEndreBrevmottakere, personopplysninger }) => {
    const { brevmottakere, hentBrevmottakere, lagreBrevmottakere } = useBrevmottakere(context);

    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    return (
        <DataViewer type={'brevmottakere'} response={{ brevmottakere }}>
            {({ brevmottakere }) => (
                <>
                    <Brevmottakere
                        mottakere={brevmottakere}
                        kanEndreBrevmottakere={kanEndreBrevmottakere}
                        settVisBrevmottakereModal={settVisBrevmottakereModal}
                    />
                    <EndreBrevmottakereModal
                        personopplysninger={personopplysninger}
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
