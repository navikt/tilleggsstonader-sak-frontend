import React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';

import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';

const erAktivitetLagtTil = (aktiviteter: Aktivitet[], registerAktivitet: Registeraktivitet) =>
    aktiviteter.some((aktivitet) => registerAktivitet.id === aktivitet.kildeId);

export function BrukAktivitetKnapp({
    registerAktivitet,
    leggTilAktivitetFraRegister,
}: {
    registerAktivitet: Registeraktivitet;
    leggTilAktivitetFraRegister: (registerAktivitet: Registeraktivitet) => void;
}) {
    const { aktiviteter } = useInngangsvilkår();
    return (
        <>
            {erAktivitetLagtTil(aktiviteter, registerAktivitet) ? (
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
                    onClick={() => leggTilAktivitetFraRegister(registerAktivitet)}
                >
                    Bruk
                </Button>
            )}
        </>
    );
}
