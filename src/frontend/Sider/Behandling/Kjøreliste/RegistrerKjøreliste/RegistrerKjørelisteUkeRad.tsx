import React, { FC, useState } from 'react';

import { BodyShort, Heading, HStack, Table } from '@navikt/ds-react';

import { RegistrerKjørelisteUkeInnhold } from './RegistrerKjørelisteUkeInnhold';
import { TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import {
    RegistrertKjørtUke,
    RegistrertKjørtUkePostRequest,
    RegistrertKjørtUkePutRequest,
    UkeVurdering,
} from '../../../../typer/kjøreliste';
import { Ressurs } from '../../../../typer/ressurs';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import {
    dagensDato,
    erFør,
    formaterIsoPeriode,
    formaterNullableIsoDato,
} from '../../../../utils/dato';
import styles from '../Reisevurdering/UkeRad.module.css';
import { finnDelperiodeForUke } from '../utils';

export const RegistrerKjørelisteUkeRad: FC<{
    uke: UkeVurdering;
    oppdaterUke: (uke: UkeVurdering) => void;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
    reiseId: string;
    registrertKjørtUkerForReise: RegistrertKjørtUke[];
    lagreRegistrertUke: (
        req: RegistrertKjørtUkePostRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
    oppdaterRegistrertUke: (
        ukeId: string,
        req: RegistrertKjørtUkePutRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
}> = ({
    uke,
    delperioder,
    reiseId,
    registrertKjørtUkerForReise,
    lagreRegistrertUke,
    oppdaterRegistrertUke,
}) => {
    const [erAapen, settErAapen] = useState(false);
    const [redigerer, settRedigerer] = useState(false);

    const relevantDelperiodeForUke = finnDelperiodeForUke(delperioder, uke);

    const utbetaltePerioder =
        uke.kjørelisteInnsendtDato && erFør(uke.kjørelisteInnsendtDato, dagensDato());

    const registrertKjørtUke = registrertKjørtUkerForReise.find((u) =>
        u.dager.some((d) => d.dato >= uke.fraDato && d.dato <= uke.tilDato)
    );

    return (
        <Table.ExpandableRow
            open={erAapen}
            expandOnRowClick={true}
            onOpenChange={(open) => {
                settErAapen(open);
                if (!open) settRedigerer(false);
            }}
            style={{
                backgroundColor: utbetaltePerioder ? 'var(--ax-bg-neutral-moderate)' : undefined,
            }}
            content={
                <RegistrerKjørelisteUkeInnhold
                    uke={uke}
                    delperiodeForUke={relevantDelperiodeForUke}
                    utbetaltePerioder={utbetaltePerioder}
                    reiseId={reiseId}
                    registrertKjørtUke={registrertKjørtUke}
                    lagreRegistrertUke={lagreRegistrertUke}
                    oppdaterRegistrertUke={oppdaterRegistrertUke}
                    redigerer={redigerer}
                    settRedigerer={settRedigerer}
                />
            }
        >
            <TableHeaderCellSmall>
                <HStack justify="space-between" align="center">
                    <div className={styles.grid}>
                        <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                        <HStack gap="space-40">
                            <BodyShort size="small">
                                {formaterIsoPeriode(uke.fraDato, uke.tilDato)}
                            </BodyShort>
                        </HStack>
                    </div>
                    <HStack gap="space-40" align="center">
                        {utbetaltePerioder && (
                            <BodyShort size="small">
                                Utbetalt {formaterNullableIsoDato(uke.kjørelisteInnsendtDato)}
                            </BodyShort>
                        )}
                    </HStack>
                </HStack>
            </TableHeaderCellSmall>
        </Table.ExpandableRow>
    );
};
