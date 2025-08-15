import React, { useState } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Table, Textarea, VStack } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { useVilkår } from '../../../../context/VilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ModalWrapper } from '../../../../komponenter/Modal/ModalWrapper';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { SlettVilkårRespons, Vilkår } from '../../vilkår';
import { vilkårTypeTilUtgiftTekst } from '../tekster';

const SlettVilkårModal: React.FC<{
    vilkår: Vilkår;
    avsluttRedigering: () => void;
}> = ({ vilkår, avsluttRedigering }) => {
    const { behandling } = useBehandling();
    const { slettVilkår } = useVilkår();

    const kanSlettePeriodePermanent = vilkår.status === 'NY' || vilkår.erFremtidigUtgift;

    const [visModal, settVisModal] = useState(false);
    const [feil, settFeil] = useState('');
    const [laster, settLaster] = useState(false);
    const [slettBegrunnelse, settSlettBegrunnelse] = useState('');

    const slettVilkårsperiode = () => {
        if (laster) return;

        if (!kanSlettePeriodePermanent && !slettBegrunnelse) {
            settFeil('Begrunnelse for sletting er påkrevd');
            return;
        }
        settLaster(true);
        settFeil('');

        slettVilkår({
            id: vilkår.id,
            behandlingId: behandling.id,
            kommentar: slettBegrunnelse,
        })
            .then((res: RessursSuksess<SlettVilkårRespons> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    avsluttRedigering();
                } else {
                    settFeil(`Feil ved sletting av vilkårperiode: ${res.frontendFeilmelding}`);
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
                    settVisModal(true);
                }}
            >
                Slett vilkår
            </SmallButton>
            <ModalWrapper
                visModal={visModal}
                onClose={lukkModal}
                tittel={
                    kanSlettePeriodePermanent
                        ? 'Er du sikker på at du vil slette perioden?'
                        : 'Slett periode'
                }
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
                                    <Table.HeaderCell>Utgift</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row shadeOnHover={false}>
                                    <Table.DataCell width="max-content">
                                        <VilkårsresultatIkon vilkårsresultat={vilkår.resultat} />
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
                                    <Table.DataCell>{vilkår.utgift}</Table.DataCell>
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
