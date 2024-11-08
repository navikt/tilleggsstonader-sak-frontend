import React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';

import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet } from '../typer/aktivitet';

const erAktivitetLagtTil = (aktiviteter: Aktivitet[], aktivitetFraArena: Registeraktivitet) =>
    aktiviteter.some((aktivitet) => aktivitetFraArena.id === (aktivitet.kildeId as string));

export function BrukAktivitetKnapp({
    aktivitetFraArena,
    leggTilAktivitetFraRegister,
}: {
    aktivitetFraArena: Registeraktivitet;
    leggTilAktivitetFraRegister: (aktivitetFraArena: Registeraktivitet) => void;
}) {
    const { aktiviteter } = useInngangsvilkår();
    return (
        <>
            {erAktivitetLagtTil(aktiviteter, aktivitetFraArena) ? (
                <Tag
                    size="small"
                    variant="neutral"
                    icon={<CheckmarkIcon />}
                    style={{ maxWidth: 'fit-content', background: 'transparent', border: 'none' }}
                >
                    Brukt
                </Tag>
            ) : (
                <Button
                    size="xsmall"
                    onClick={() => leggTilAktivitetFraRegister(aktivitetFraArena)}
                >
                    Bruk
                </Button>
            )}
        </>
    );
}
