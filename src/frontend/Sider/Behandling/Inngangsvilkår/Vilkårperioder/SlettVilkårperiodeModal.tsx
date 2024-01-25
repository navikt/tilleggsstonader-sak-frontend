import React, { SetStateAction, useState } from 'react';

import { Table, Textarea, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { formaterIsoDato } from '../../../../utils/dato';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';
import { SlettVilkårperiode, VilkårPeriode } from '../typer/vilkårperiode';

const SlettVilkårperiodeModal: React.FC<{
    visModal: boolean;
    settVisModal: React.Dispatch<SetStateAction<boolean>>;
    vilkårperiode: VilkårPeriode;
    type: MålgruppeType | AktivitetType;
}> = ({ vilkårperiode, visModal, settVisModal, type }) => {
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
            tittel={'Slett periode'}
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
            <VStack gap="4">
                <Table>
                    <Table.Header>
                        <Table.Row shadeOnHover={false}>
                            <Table.HeaderCell style={{ width: '20px' }} />
                            <Table.HeaderCell>Ytelse/situasjon</Table.HeaderCell>
                            <Table.HeaderCell>Fra</Table.HeaderCell>
                            <Table.HeaderCell>Til</Table.HeaderCell>
                            <Table.HeaderCell>Kilde</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row shadeOnHover={false}>
                            <Table.DataCell width="max-content">
                                <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
                            </Table.DataCell>
                            <Table.DataCell>{type}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(vilkårperiode.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(vilkårperiode.tom)}</Table.DataCell>
                            <Table.DataCell>{vilkårperiode.kilde}</Table.DataCell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Textarea
                    label={'Begrunnelse for sletting (obligatorisk)'}
                    value={slettBegrunnelse}
                    onChange={(e) => settSlettBegrunnelse(e.target.value)}
                    error={feil}
                />
            </VStack>
        </ModalWrapper>
    );
};

export default SlettVilkårperiodeModal;
