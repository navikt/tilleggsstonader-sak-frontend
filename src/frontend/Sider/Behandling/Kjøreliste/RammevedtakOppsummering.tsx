import React, { FC } from 'react';

import { BodyShort, Heading, Label, Table, VStack } from '@navikt/ds-react';

import styles from './RammevedtakOppsummering.module.css';
import Panel from '../../../komponenter/Panel/Panel';
import { TableHeaderCellSmall } from '../../../komponenter/TabellSmall';
import { ReisevurderingPrivatBil } from '../../../typer/kjøreliste';
import { RammevedtakPrivatBil } from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriode } from '../../../utils/dato';
import { formatBoolean } from '../../../utils/tekstformatering';

export const RammevedtakOppsummering: FC<{
    rammevedtak: RammevedtakPrivatBil;
    kjørelister: ReisevurderingPrivatBil[];
}> = ({ rammevedtak, kjørelister }) => {
    return rammevedtak.reiser.map((reise) => {
        const relevantKjøreliste = kjørelister.find((k) => k.reiseId === reise.reiseId);
        return (
            <Panel
                tittel={`${reise.aktivitetsadresse} (${formaterIsoPeriode(reise.fom, reise.tom)})`}
                key={reise.reiseId}
            >
                <VStack gap="space-16">
                    <div>
                        <Heading size="xsmall" level="3">
                            Rammevedtak
                        </Heading>
                        <div className={styles.seksKolonnerGrid}>
                            <Label size="small">Reisedager per uke</Label>
                            <Label size="small">Reiseavstand én vei</Label>
                            <Label size="small">Kilometersats</Label>
                            <Label size="small">Dagsats u/parkering</Label>
                            <Label size="small">Bompenger én vei</Label>
                            <Label size="small">Fergekostnader én vei</Label>
                            <BodyShort size="small">{reise.reisedagerPerUke}</BodyShort>
                            <BodyShort size="small">{reise.reiseavstandEnVei}</BodyShort>
                            <BodyShort size="small">{reise.kilometersats}</BodyShort>
                            <BodyShort size="small">{reise.dagsatsUtenParkering}</BodyShort>
                            <BodyShort size="small">{reise.bompengerEnVei || '-'}</BodyShort>
                            <BodyShort size="small">{reise.fergekostnadEnVei || '-'}</BodyShort>
                        </div>
                    </div>
                    <div>
                        <Heading size="xsmall" level="3">
                            Innsendte kjørelister
                        </Heading>
                        {relevantKjøreliste ? (
                            <KjørelisteForReiseTabell
                                kjøreliste={kjørelister.find((k) => k.reiseId === reise.reiseId)}
                            />
                        ) : (
                            <BodyShort size="small">
                                Ingen kjøreliste innsendt for denne reisen
                            </BodyShort>
                        )}
                    </div>
                </VStack>
            </Panel>
        );
    });
};

const KjørelisteForReiseTabell: FC<{ kjøreliste: ReisevurderingPrivatBil | undefined }> = ({
    kjøreliste,
}) => {
    return (
        <Table size="small">
            <Table.Body>
                {kjøreliste?.uker.map((uke, index) => (
                    <Table.ExpandableRow
                        key={index}
                        content={
                            <div className={styles.treKolonnerGrid}>
                                <Label size="small">Dato</Label>
                                <Label size="small">Har kjørt</Label>
                                <Label size="small">Parking</Label>
                                {uke.dager.map((dag, dagIndeks) => (
                                    <React.Fragment key={dagIndeks}>
                                        <BodyShort size="small">{dag.dato}</BodyShort>
                                        <BodyShort size="small">
                                            {formatBoolean(dag.kjørelisteDag?.harKjørt)}
                                        </BodyShort>
                                        <BodyShort size="small">
                                            {dag.kjørelisteDag?.parkeringsutgift
                                                ? `${dag.kjørelisteDag?.parkeringsutgift} kr`
                                                : '-'}
                                        </BodyShort>
                                    </React.Fragment>
                                ))}
                            </div>
                        }
                    >
                        <TableHeaderCellSmall>{`Uke ${uke.ukenummer}`}</TableHeaderCellSmall>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    );
};
