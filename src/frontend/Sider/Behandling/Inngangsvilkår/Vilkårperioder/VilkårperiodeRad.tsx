import React, { useRef, useState } from 'react';

import { styled } from 'styled-components';

import { ChatIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Detail, HStack, Popover, Spacer, Table, VStack } from '@navikt/ds-react';
import { ABgSubtle } from '@navikt/ds-tokens/dist/tokens';

import { KildeIkon } from './KildeIkon';
import SlettVilkRperiodeModal from './SlettVilkårperiodeModal';
import { useBehandling } from '../../../../context/BehandlingContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import Lesefelt from '../../../../komponenter/Skjema/Lesefelt';
import { formaterIsoDato, formaterIsoDatoTidMedSekunder } from '../../../../utils/dato';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';
import { VilkårPeriode, VilkårPeriodeResultat } from '../typer/vilkårperiode';

const TabellRad = styled(Table.Row)<{ disabled?: boolean }>`
    background: ${(props) => (props.disabled ? ABgSubtle : '')};
`;

const BegrunnelseContainer = styled(VStack)`
    max-width: 48rem;
`;

const VilkårperiodeRad: React.FC<{
    vilkårperiode: VilkårPeriode;
    type: MålgruppeType | AktivitetType;
    startRedigering: () => void;
}> = ({ vilkårperiode, type, startRedigering }) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [visSlettModal, settVisSlettModal] = useState(false);
    const visRedigerKnapper =
        vilkårperiode.resultat != VilkårPeriodeResultat.SLETTET && behandlingErRedigerbar;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const [visBeskrivelse, settVisBeskrivelse] = useState(false);

    return (
        <TabellRad
            key={vilkårperiode.id}
            disabled={vilkårperiode.resultat === VilkårPeriodeResultat.SLETTET}
        >
            <Table.DataCell width="max-content">
                <HStack align="center">
                    <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
                </HStack>
            </Table.DataCell>
            <Table.DataCell>
                <HStack align="center">
                    {type}
                    {vilkårperiode.begrunnelse && (
                        <>
                            <Spacer />
                            <Button
                                ref={buttonRef}
                                icon={<ChatIcon />}
                                size={'small'}
                                variant={'tertiary'}
                                onClick={() => settVisBeskrivelse(!visBeskrivelse)}
                            />
                            <Popover
                                anchorEl={buttonRef.current}
                                open={visBeskrivelse}
                                onClose={() => settVisBeskrivelse(false)}
                            >
                                <Popover.Content>
                                    <BegrunnelseContainer gap="4">
                                        <Detail>
                                            Sist endret{' '}
                                            {formaterIsoDatoTidMedSekunder(
                                                vilkårperiode.sistEndret
                                            )}
                                        </Detail>
                                        {vilkårperiode.resultat ===
                                            VilkårPeriodeResultat.SLETTET && (
                                            <Lesefelt
                                                verdi={vilkårperiode.slettetKommentar}
                                                label={'Begrunnelse for sletting'}
                                            />
                                        )}
                                        <Lesefelt
                                            verdi={vilkårperiode.begrunnelse}
                                            label={'Begrunnelse periode'}
                                        />
                                    </BegrunnelseContainer>
                                </Popover.Content>
                            </Popover>
                        </>
                    )}
                </HStack>
            </Table.DataCell>
            <Table.DataCell>{formaterIsoDato(vilkårperiode.fom)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(vilkårperiode.tom)}</Table.DataCell>
            <Table.DataCell>
                <KildeIkon kilde={vilkårperiode.kilde} />
            </Table.DataCell>
            <Table.DataCell>
                {visRedigerKnapper && (
                    <HStack gap="2">
                        <Button
                            onClick={startRedigering}
                            variant="secondary"
                            size="xsmall"
                            icon={<PencilIcon />}
                        >
                            Endre
                        </Button>
                        <Button
                            icon={<TrashIcon />}
                            size="xsmall"
                            variant={'tertiary'}
                            onClick={() => settVisSlettModal(true)}
                        />
                        <SlettVilkRperiodeModal
                            visModal={visSlettModal}
                            settVisModal={settVisSlettModal}
                            vilkårperiode={vilkårperiode}
                            type={type}
                        />
                    </HStack>
                )}
            </Table.DataCell>
        </TabellRad>
    );
};

export default VilkårperiodeRad;
