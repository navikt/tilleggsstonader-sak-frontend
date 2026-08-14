import React, { FC } from 'react';

import { BodyShort, Heading, HStack, Table } from '@navikt/ds-react';

import { TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { KjørelisteDag, KjørelisteUke } from '../typer';
import { UkeGrid } from '../UkeGrid';
import { RedigerLagretKjørelisteDag } from './RedigerLagretKjørelisteDag';
import { UkeInnholdLagretKjøreliste } from './UkeInnholdLagretKjøreliste';

interface Props {
    redigerer: boolean;
    ukerForRendering: KjørelisteUke[];
    dagerPerUke: Record<string, KjørelisteDag[]>;
    oppdaterDagForUke: (ukeFom: string, oppdatertDag: KjørelisteDag) => void;
    forsøktLagret: boolean;
}

export const LagretKjørelisteUkerTabell: FC<Props> = ({
    redigerer,
    ukerForRendering,
    dagerPerUke,
    oppdaterDagForUke,
    forsøktLagret,
}) => {
    return (
        <Table size="small" width="fit-content">
            <Table.Body>
                {ukerForRendering.map((uke) => (
                    <Table.ExpandableRow
                        key={uke.fom}
                        expandOnRowClick
                        defaultOpen
                        content={
                            redigerer ? (
                                <UkeGrid>
                                    {(dagerPerUke[uke.fom] ?? []).map((dag) => (
                                        <RedigerLagretKjørelisteDag
                                            key={dag.dato}
                                            dag={dag}
                                            forsøktLagret={forsøktLagret}
                                            oppdaterDag={(oppdatertDag) =>
                                                oppdaterDagForUke(uke.fom, oppdatertDag)
                                            }
                                        />
                                    ))}
                                </UkeGrid>
                            ) : (
                                <UkeInnholdLagretKjøreliste dager={uke.dager} />
                            )
                        }
                    >
                        <TableHeaderCellSmall>
                            <HStack gap="space-16" align="center">
                                <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                                <BodyShort size="small">
                                    {formaterIsoPeriode(uke.fom, uke.tom)}
                                </BodyShort>
                            </HStack>
                        </TableHeaderCellSmall>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    );
};
