import React, { SetStateAction, useState } from 'react';

import { Textarea } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { SlettVilkårperiode, VilkårPeriode } from '../typer/vilkårperiode';

const SlettVilkårperiodeModal: React.FC<{
    visModal: boolean;
    settVisModal: React.Dispatch<SetStateAction<boolean>>;
    vilkårperiode: VilkårPeriode;
}> = ({ vilkårperiode, visModal, settVisModal }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { hentVilkårperioder } = useInngangsvilkår();

    const [feil, settFeil] = useState('');
    const [laster, settLaster] = useState(false);
    const [slettBegrunnelse, settSlettBegrunnelse] = useState('');

    const slettVilkårsperiode = () => {
        if (laster) return;
        settLaster(true);
        settFeil('');
        if (slettBegrunnelse) {
            request<VilkårPeriode, SlettVilkårperiode>(
                `/api/sak/vilkarperiode/${vilkårperiode.id}`,
                'DELETE',
                { behandlingId: behandling.id, kommentar: slettBegrunnelse }
            )
                .then((res: RessursSuksess<VilkårPeriode> | RessursFeilet) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        hentVilkårperioder.rerun();
                        settVisModal(false);
                    } else {
                        settFeil(`Feil ved sletting av vilkårperiode: ${res.frontendFeilmelding}`);
                    }
                })
                .finally(() => settLaster(false));
        } else {
            settFeil('Begrunnelse for sletting er påkrevd');
            settLaster(false);
        }
    };

    const lukkModal = () => {
        settFeil('');
        settSlettBegrunnelse('');
        settVisModal(false);
        settLaster(false);
    };

    return (
        <ModalWrapper
            visModal={visModal}
            onClose={lukkModal}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: slettVilkårsperiode,
                    tekst: 'Slett og lagre begrunnelse',
                },
                lukkKnapp: {
                    onClick: lukkModal,
                    tekst: 'Angre sletting',
                },
            }}
        >
            <Textarea
                label={'Begrunnelse for sletting (obligatorisk)'}
                value={slettBegrunnelse}
                onChange={(e) => settSlettBegrunnelse(e.target.value)}
                error={feil}
            />
        </ModalWrapper>
    );
};

export default SlettVilkårperiodeModal;
