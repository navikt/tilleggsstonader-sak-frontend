import React, { FC, useCallback, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { VergerOgFullmektigeFraRegister } from './VergerOgFullmektigeFraRegister';
import { SøkWrapper } from './SøkWrapper';
import { SkalBrukerHaBrev } from './SkalBrukerHaBrev';
import { useApp } from '../../../App/context/AppContext';
import { BrevmottakereListe } from './BrevmottakereListe';
import { IBrevmottaker, IBrevmottakere, IOrganisasjonMottaker } from './typer';
import styled from 'styled-components';
import { Alert, Button } from '@navikt/ds-react';
import { EToast } from '../../../App/typer/toast';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { brevmottakereStub } from '../../../App/api/klage-stubs';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 100fr 1fr 100fr;
    column-gap: 2rem;
`;
const Venstrekolonne = styled.div``;
const Høyrekolonne = styled.div``;

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

export const BrevmottakereModal: FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    mottakere: IBrevmottakere;
    kallHentBrevmottakere: () => void;
}> = ({ behandlingId, personopplysninger, mottakere, kallHentBrevmottakere }) => {
    const { visBrevmottakereModal, settVisBrevmottakereModal } = useApp();

    const [valgtePersonMottakere, settValgtePersonMottakere] = useState<IBrevmottaker[]>([]);

    const [valgteOrganisasjonMottakere, settValgteOrganisasjonMottakere] = useState<
        IOrganisasjonMottaker[]
    >([]);
    const [feilmelding, settFeilmelding] = useState('');
    const [innsendingSuksess, settInnsendingSukksess] = useState(false);
    const { settToast, axiosRequest } = useApp();

    const kallSettBrevmottakere = useCallback(
        (brevmottakere: IBrevmottakere) =>
            axiosRequest<IBrevmottakere, IBrevmottakere>({
                url: `api/klage/brev/${behandlingId}/mottakere`,
                method: 'POST',
                data: brevmottakere,
            }),
        [axiosRequest, behandlingId]
    );

    useEffect(() => {
        settValgtePersonMottakere(mottakere.personer);
        settValgteOrganisasjonMottakere(mottakere.organisasjoner);
    }, [mottakere]);

    const settBrevmottakere = () => {
        settFeilmelding('');
        settInnsendingSukksess(false);
        kallSettBrevmottakere({
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
