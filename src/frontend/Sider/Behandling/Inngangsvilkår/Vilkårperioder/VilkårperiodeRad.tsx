import React, { useRef, useState } from 'react';

import { styled } from 'styled-components';

import { ChatIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Button,
    Detail,
    HStack,
    Popover,
    Spacer,
    Table,
    VStack,
} from '@navikt/ds-react';
import { ABgSubtle } from '@navikt/ds-tokens/dist/tokens';

import { KildeIkon } from './KildeIkon';
import SlettVilkårperiodeModal from './SlettVilkårperiodeModal';
import { useSteg } from '../../../../context/StegContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import Lesefelt from '../../../../komponenter/Skjema/Lesefelt';
import { formaterIsoDato, formaterIsoDatoTidMedSekunder } from '../../../../utils/dato';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';
import {
    VilkårPeriode,
    VilkårPeriodeResultat,
    vilkårperiodeTypeTilTekst,
} from '../typer/vilkårperiode';

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
    aktivitetsdager?: number;
}> = ({ vilkårperiode, type, startRedigering, aktivitetsdager }) => {
    const { erStegOgBehandlingRedigerbar } = useSteg();

    const [visSlettModal, settVisSlettModal] = useState(false);
    const visRedigerKnapper =
        vilkårperiode.resultat != VilkårPeriodeResultat.SLETTET && erStegOgBehandlingRedigerbar;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const [visBeskrivelse, settVisBeskrivelse] = useState(false);

    return (
        <TabellRad
            key={vilkårperiode.id}
            disabled={vilkårperiode.resultat === VilkårPeriodeResultat.SLETTET}
            shadeOnHover={false}
        >
            <Table.DataCell width="max-content">
                <HStack align="center">
                    <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
                </HStack>
            </Table.DataCell>
            <Table.DataCell>
                <HStack align="center">
                    <BodyShort size="small">{vilkårperiodeTypeTilTekst[type]}</BodyShort>
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
            <Table.DataCell>
                <BodyShort size="small">{formaterIsoDato(vilkårperiode.fom)}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                <BodyShort size="small">{formaterIsoDato(vilkårperiode.tom)}</BodyShort>
            </Table.DataCell>
            {aktivitetsdager && (
                <Table.DataCell align="center">
                    <BodyShort size="small">{aktivitetsdager}</BodyShort>
                </Table.DataCell>
            )}
            <Table.DataCell align="center">
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
                        <SlettVilkårperiodeModal
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
