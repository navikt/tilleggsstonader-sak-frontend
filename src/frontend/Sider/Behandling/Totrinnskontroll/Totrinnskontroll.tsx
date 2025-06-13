import * as React from 'react';
import { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { TotrinnskontrollSwitch } from './TotrinnskontrollSwitch';
import { useTotrinnskontroll } from '../../../context/TotrinnskontrollContext';
import DataViewer from '../../../komponenter/DataViewer';
import { ModalWrapper } from '../../../komponenter/Modal/ModalWrapper';

const Totrinnskontroll: FC = () => {
    const navigate = useNavigate();

    const [visGodkjentModal, settVisGodkjentModal] = useState(false);

    const { totrinnskontroll, settTotrinnskontroll } = useTotrinnskontroll();

    return (
        <>
            <DataViewer type={'totrinnskontroll'} response={{ totrinnskontroll }}>
                {({ totrinnskontroll }) => (
                    <TotrinnskontrollSwitch
                        totrinnskontroll={totrinnskontroll}
                        settVisModalGodkjent={settVisGodkjentModal}
                        settTotrinnskontroll={settTotrinnskontroll}
                    />
                )}
            </DataViewer>
            <ModalWrapper
                tittel={'Vedtaket er godkjent'}
                visModal={visGodkjentModal}
                onClose={() => settVisGodkjentModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => navigate('/'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: { onClick: () => settVisGodkjentModal(false), tekst: 'Lukk' },
                }}
            />
        </>
    );
};

export default Totrinnskontroll;
