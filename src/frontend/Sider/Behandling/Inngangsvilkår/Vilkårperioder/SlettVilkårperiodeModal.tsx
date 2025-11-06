import React, { useState } from 'react';

import { Button, Table, Textarea, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FargetVilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { formaterIsoDato } from '../../../../utils/dato';
import { harIkkeVerdi } from '../../../../utils/utils';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useSlettePeriodeFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { erMålgruppe } from '../Målgruppe/utils';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import { Målgruppe } from '../typer/vilkårperiode/målgruppe';
import {
    KildeVilkårsperiode,
    LagreVilkårperiodeResponse,
    SlettVilkårperiode,
} from '../typer/vilkårperiode/vilkårperiode';

type Response = LagreVilkårperiodeResponse<Aktivitet | Målgruppe | null>;

const SlettVilkårperiode: React.FC<{
    vilkårperiode: Målgruppe | Aktivitet;
    avbrytRedigering: () => void;
}> = ({ vilkårperiode, avbrytRedigering }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { oppdaterAktivitet, oppdaterMålgruppe, slettVilkårperiode } = useInngangsvilkår();

    const kanSlettePeriodePermanent =
        vilkårperiode.kilde !== KildeVilkårsperiode.SYSTEM &&
        harIkkeVerdi(vilkårperiode.forrigeVilkårperiodeId);

    const [visModal, settVisModal] = useState(false);
    const [feil, settFeil] = useState('');
    const [laster, settLaster] = useState(false);
    const [slettBegrunnelse, settSlettBegrunnelse] = useState('');
    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useSlettePeriodeFørTidligereVedtak({
            tidligere: vilkårperiode,
        });

    const slettPeriodeEllerVisBekreftModal = () => {
        if (burdeViseModal) {
            settVisBekreftModal(true);
        } else {
            settVisModal(true);
        }
    };

    const slettVilkårsperiode = () => {
        if (laster) return;

        if (!kanSlettePeriodePermanent && !slettBegrunnelse) {
            settFeil('Begrunnelse for sletting er påkrevd');
            return;
        }
        settLaster(true);
        settFeil('');

        request<Response, SlettVilkårperiode>(
            `/api/sak/vilkarperiode/${vilkårperiode.id}`,
            'DELETE',
            { behandlingId: behandling.id, kommentar: slettBegrunnelse }
        )
            .then((res: RessursSuksess<Response> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    if (res.data.periode) {
                        markerPeriodeSomSlettet(res.data.periode);
                    } else {
                        slettVilkårperiode(vilkårperiode.type, vilkårperiode.id);
                    }

                    settVisModal(false);
                    avbrytRedigering();
                } else {
                    settFeil(`Feil ved sletting av vilkårperiode: ${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
    };

    const markerPeriodeSomSlettet = (periode: Aktivitet | Målgruppe) => {
        if (erMålgruppe(periode)) {
            oppdaterMålgruppe(periode);
        } else {
            oppdaterAktivitet(periode);
        }
    };

    const lukkModal = () => {
        settFeil('');
        settSlettBegrunnelse('');
        settVisModal(false);
        settLaster(false);
    };

    return (
        <>
            <Button size="small" variant={'tertiary'} onClick={slettPeriodeEllerVisBekreftModal}>
                Slett
            </Button>
            <BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal
                visBekreftModal={visBekreftModal}
                settVisBekreftModal={settVisBekreftModal}
                bekreftLagre={() => {
                    settVisBekreftModal(false);
                    settVisModal(true);
                }}
                laster={laster}
            />
            <ModalWrapper
                visModal={visModal}
                onClose={lukkModal}
                tittel={
                    kanSlettePeriodePermanent
                        ? 'Er du sikker på at du vil slette perioden?'
                        : 'Slett periode'
                }
                umamiId={'slett-vilkårperiode'}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: slettVilkårsperiode,
                        tekst: kanSlettePeriodePermanent ? 'Slett' : 'Slett og lagre begrunnelse',
                    },
                    lukkKnapp: {
                        onClick: lukkModal,
                        tekst: 'Angre sletting',
                    },
                }}
            >
                {!kanSlettePeriodePermanent && (
                    <VStack gap="4">
                        <Table>
                            <Table.Header>
                                <Table.Row shadeOnHover={false}>
                                    <Table.HeaderCell style={{ width: '20px' }} />
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Fra</Table.HeaderCell>
                                    <Table.HeaderCell>Til</Table.HeaderCell>
                                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row shadeOnHover={false}>
                                    <Table.DataCell width="max-content">
                                        <FargetVilkårsresultatIkon
                                            vilkårsresultat={vilkårperiode.resultat}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>{vilkårperiode.type}</Table.DataCell>
                                    <Table.DataCell>
                                        {formaterIsoDato(vilkårperiode.fom)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterIsoDato(vilkårperiode.tom)}
                                    </Table.DataCell>
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
                )}
            </ModalWrapper>
        </>
    );
};

export default SlettVilkårperiode;
