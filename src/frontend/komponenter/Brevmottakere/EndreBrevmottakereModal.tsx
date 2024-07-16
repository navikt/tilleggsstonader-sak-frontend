import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Alert, Button } from '@navikt/ds-react';

import { BrevmottakereListe } from './BrevmottakereListe';
import { SkalBrukerHaBrev } from './SkalBrukerHaBrev';
import { SøkWrapper } from './SøkWrapper';
import { IBrevmottaker, IBrevmottakere, IOrganisasjonMottaker } from './typer';
import { VergerOgFullmektigeFraRegister } from './VergerOgFullmektigeFraRegister';
import { useKlageApp } from '../../Sider/Klage/context/KlageAppContext';
import { useLagreBrevmottakere } from '../../Sider/Klage/hooks/useLagreBrevmottakere';
import { EToast } from '../../Sider/Klage/typer/toast';
import { Personopplysninger } from '../../typer/personopplysninger';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { ModalWrapper } from '../Modal/ModalWrapper';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 100fr 1fr 100fr;
    column-gap: 2rem;
`;

const Venstrekolonne = styled.div`
    margin-left: 2rem;
`;

const Høyrekolonne = styled.div`
    margin-right: 2rem;
`;

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;

    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

const HorisontalLinje = styled.div`
    height: 0;

    border: 2px solid #f3f3f3;

    margin-top: 2rem;
    margin-bottom: 1.5rem;
`;

const VertikalLinje = styled.div`
    border-left: 2px solid #f3f3f3;
    width: 5px;
    margin-bottom: 1rem;
`;
export const EndreBrevmottakereModal: FC<{
    behandlingId: string;
    personopplysninger: Personopplysninger;
    mottakere: IBrevmottakere;
    kallHentBrevmottakere: () => void;
    visBrevmottakereModal: boolean;
    settVisBrevmottakereModal: (value: boolean) => void;
}> = ({
    behandlingId,
    personopplysninger,
    mottakere,
    kallHentBrevmottakere,
    visBrevmottakereModal,
    settVisBrevmottakereModal,
}) => {
    const [valgtePersonMottakere, settValgtePersonMottakere] = useState<IBrevmottaker[]>([]);

    const [valgteOrganisasjonMottakere, settValgteOrganisasjonMottakere] = useState<
        IOrganisasjonMottaker[]
    >([]);
    const [feilmelding, settFeilmelding] = useState('');
    const [innsendingSuksess, settInnsendingSukksess] = useState(false);
    const { settToast } = useKlageApp();

    const { lagreBrevmottakere } = useLagreBrevmottakere(behandlingId);

    useEffect(() => {
        settValgtePersonMottakere(mottakere.personer);
        settValgteOrganisasjonMottakere(mottakere.organisasjoner);
    }, [mottakere]);

    const settBrevmottakere = () => {
        settFeilmelding('');
        settInnsendingSukksess(false);
        lagreBrevmottakere({
            personer: valgtePersonMottakere,
            organisasjoner: valgteOrganisasjonMottakere,
        }).then((response: RessursSuksess<IBrevmottakere> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                kallHentBrevmottakere();
                settVisBrevmottakereModal(false);
                settToast(EToast.BREVMOTTAKERE_SATT);
            } else {
                settFeilmelding(response.frontendFeilmelding);
            }
        });
    };

    const harValgtMottakere =
        valgtePersonMottakere.length > 0 || valgteOrganisasjonMottakere.length > 0;

    return (
        <ModalWrapper
            tittel={'Hvem skal motta brevet?'}
            visModal={visBrevmottakereModal}
            onClose={() => {
                settVisBrevmottakereModal(false);
            }}
            maxWidth={70}
            ariaLabel={'Velg brevmottakere'}
        >
            <GridContainer>
                <Venstrekolonne>
                    <VergerOgFullmektigeFraRegister
                        verger={personopplysninger.vergemål}
                        fullmakter={personopplysninger.fullmakt}
                        valgteMottakere={valgtePersonMottakere}
                        settValgteMottakere={settValgtePersonMottakere}
                    />
                    <HorisontalLinje />
                    <SøkWrapper
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                        behandlingId={behandlingId}
                    />
                    <HorisontalLinje />
                    <SkalBrukerHaBrev
                        valgteBrevmottakere={valgtePersonMottakere}
                        settValgtBrevMottakere={settValgtePersonMottakere}
                        personopplysninger={personopplysninger}
                    />
                </Venstrekolonne>
                <VertikalLinje />
                <Høyrekolonne>
                    <BrevmottakereListe
                        valgtePersonMottakere={valgtePersonMottakere}
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                </Høyrekolonne>
            </GridContainer>
            <SentrerKnapper>
                <Button variant="tertiary" onClick={() => settVisBrevmottakereModal(false)}>
                    Avbryt
                </Button>
                <Button variant="primary" onClick={settBrevmottakere} disabled={!harValgtMottakere}>
                    Sett mottakere
                </Button>
            </SentrerKnapper>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            {innsendingSuksess && <Alert variant={'success'}>Brevmottakere er satt</Alert>}
        </ModalWrapper>
    );
};
