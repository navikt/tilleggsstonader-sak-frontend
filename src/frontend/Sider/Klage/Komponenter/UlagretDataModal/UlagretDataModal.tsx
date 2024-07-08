import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKlageApp } from '../../context/KlageAppContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';

const UlagretDataModal: FC = () => {
    const {
        nullstillIkkePersisterteKomponenter,
        visUlagretDataModal,
        valgtSide,
        settVisUlagretDataModal,
    } = useKlageApp();
    const navigate = useNavigate();

    return (
        <ModalWrapper
            tittel={
                'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden'
            }
            visModal={visUlagretDataModal}
            onClose={() => settVisUlagretDataModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => settVisUlagretDataModal(false),
                    tekst: 'Gå tilbake for å lagre',
                },
                lukkKnapp: {
                    onClick: () => {
                        if (valgtSide) {
                            nullstillIkkePersisterteKomponenter();
                            navigate(valgtSide);
                        }
                        settVisUlagretDataModal(false);
                    },
                    tekst: 'Forlat siden',
                },
            }}
        />
    );
};

export default UlagretDataModal;
