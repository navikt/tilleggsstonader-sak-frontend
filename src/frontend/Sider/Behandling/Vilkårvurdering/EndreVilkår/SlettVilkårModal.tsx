import React, { useState } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Table, Textarea, VStack } from '@navikt/ds-react';

import { FargetVilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { RessursStatus, RessursStatusFeilet } from '../../../../typer/ressurs';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useSlettePeriodeFørTidligereVedtak } from '../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { VilkårBase } from '../../vilkår';
import { vilkårTypeTilUtgiftTekst } from '../tekster';

const SlettVilkårModal: React.FC<{
    vilkår: VilkårBase;
    avsluttRedigering: () => void;
    kanSlettesPermanent: boolean;
    slettVilkår: (
        slettetBegrunnelse: string | undefined
    ) => Promise<RessursStatus.SUKSESS | RessursStatusFeilet>;
    metadataLabel: string;
    metadata: string | number;
}> = ({ vilkår, avsluttRedigering, kanSlettesPermanent, slettVilkår, metadataLabel, metadata }) => {
    const [visModal, settVisModal] = useState(false);
    const [feil, settFeil] = useState('');
    const [laster, settLaster] = useState(false);
    const [slettBegrunnelse, settSlettBegrunnelse] = useState('');

    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useSlettePeriodeFørTidligereVedtak({
            tidligere: vilkår,
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

        if (!kanSlettesPermanent && !slettBegrunnelse) {
            settFeil('Begrunnelse for sletting er påkrevd');
            return;
        }
        settLaster(true);
        settFeil('');

        slettVilkår(slettBegrunnelse)
            .then((res) => {
                if (res === RessursStatus.SUKSESS) {
                    avsluttRedigering();
                } else {
                    settFeil(`Feil ved sletting av vilkårperiode: ${res}`);
                }
            })
            .finally(() => settLaster(false));
    };

    const lukkModal = () => {
        settFeil('');
        settSlettBegrunnelse('');
        settVisModal(false);
        settLaster(false);
    };

    return (
        <>
            <SmallButton
                variant={'tertiary'}
                icon={<TrashIcon />}
                iconPosition={'right'}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    slettPeriodeEllerVisBekreftModal();
                }}
            >
                Slett vilkår
            </SmallButton>
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
                    kanSlettesPermanent
                        ? 'Er du sikker på at du vil slette perioden?'
                        : 'Slett periode'
                }
                umamiId={'slett-vilkår'}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: slettVilkårsperiode,
                        tekst: kanSlettesPermanent ? 'Slett' : 'Slett og lagre begrunnelse',
                    },
                    lukkKnapp: {
                        onClick: lukkModal,
                        tekst: 'Angre sletting',
                    },
                }}
            >
                {!kanSlettesPermanent && (
                    <VStack gap="space-16">
                        <Table>
                            <Table.Header>
                                <Table.Row shadeOnHover={false}>
                                    <Table.HeaderCell style={{ width: '20px' }} />
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Fra</Table.HeaderCell>
                                    <Table.HeaderCell>Til</Table.HeaderCell>
                                    <Table.HeaderCell>{metadataLabel}</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row shadeOnHover={false}>
                                    <Table.DataCell width="max-content">
                                        <FargetVilkårsresultatIkon
                                            vilkårsresultat={vilkår.resultat}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {vilkårTypeTilUtgiftTekst[vilkår.vilkårType]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDato(vilkår.fom)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDato(vilkår.tom)}
                                    </Table.DataCell>
                                    <Table.DataCell>{metadata}</Table.DataCell>
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

export default SlettVilkårModal;
