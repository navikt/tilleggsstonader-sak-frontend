import React, { FC, useEffect, useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import { BrevmottakereListe } from './BrevmottakereListe';
import styles from './EndreBrevmottakereModal.module.css';
import { SkalBrukerHaBrev } from './SkalBrukerHaBrev';
import { SøkWrapper } from './SøkWrapper';
import { IBrevmottaker, IBrevmottakere, IOrganisasjonMottaker } from './typer';
import { VergerOgFullmektigeFraRegister } from './VergerOgFullmektigeFraRegister';
import { useApp } from '../../context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { Toast } from '../../typer/toast';
import { PersonopplysningerIBrevmottakere } from '../Brev/typer';
import { ModalWrapper } from '../Modal/ModalWrapper';

export const EndreBrevmottakereModal: FC<{
    personopplysninger: PersonopplysningerIBrevmottakere;
    mottakere: IBrevmottakere;
    kallHentBrevmottakere: () => void;
    lagreBrevmottakere: (
        brevmottakere: IBrevmottakere
    ) => Promise<RessursSuksess<IBrevmottakere> | RessursFeilet>;
    visBrevmottakereModal: boolean;
    settVisBrevmottakereModal: (value: boolean) => void;
}> = ({
    personopplysninger,
    mottakere,
    kallHentBrevmottakere,
    lagreBrevmottakere,
    visBrevmottakereModal,
    settVisBrevmottakereModal,
}) => {
    const { settToast } = useApp();
    const [valgtePersonMottakere, settValgtePersonMottakere] = useState<IBrevmottaker[]>([]);

    const [valgteOrganisasjonMottakere, settValgteOrganisasjonMottakere] = useState<
        IOrganisasjonMottaker[]
    >([]);
    const [feilmelding, settFeilmelding] = useState('');
    const [innsendingSuksess, settInnsendingSukksess] = useState(false);

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
                settToast(Toast.BREVMOTTAKERE_SATT);
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
            umamiId={'brevmottakere'}
            visModal={visBrevmottakereModal}
            onClose={() => {
                settVisBrevmottakereModal(false);
            }}
            maxWidth={70}
            ariaLabel={'Velg brevmottakere'}
        >
            <div className={styles.gridContainer}>
                <div className={styles.venstrekolonne}>
                    <VergerOgFullmektigeFraRegister
                        verger={personopplysninger.vergemål ?? []}
                        personIdent={personopplysninger.personIdent}
                        valgteMottakere={valgtePersonMottakere}
                        settValgteMottakere={settValgtePersonMottakere}
                    />
                    <div className={styles.horisontalLinje} />
                    <SøkWrapper
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                    <div className={styles.horisontalLinje} />
                    <SkalBrukerHaBrev
                        valgteBrevmottakere={valgtePersonMottakere}
                        settValgtBrevMottakere={settValgtePersonMottakere}
                        personopplysninger={personopplysninger}
                    />
                </div>
                <div className={styles.vertikalLinje} />
                <div className={styles.høyrekolonne}>
                    <BrevmottakereListe
                        valgtePersonMottakere={valgtePersonMottakere}
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                </div>
            </div>
            <div className={styles.sentrerKnapper}>
                <Button variant="tertiary" onClick={() => settVisBrevmottakereModal(false)}>
                    Avbryt
                </Button>
                <Button variant="primary" onClick={settBrevmottakere} disabled={!harValgtMottakere}>
                    Sett mottakere
                </Button>
            </div>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            {innsendingSuksess && <Alert variant={'success'}>Brevmottakere er satt</Alert>}
        </ModalWrapper>
    );
};
