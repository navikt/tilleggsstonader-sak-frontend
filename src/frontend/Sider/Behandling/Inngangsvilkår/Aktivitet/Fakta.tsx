import React from 'react';

import styled from 'styled-components';

import TextField from '../../../../komponenter/Skjema/TextField';
import { tilHeltall } from '../../../../utils/tall';
import { FaktaAktivitet } from '../typer/aktivitet';

const FeilmeldingMaksBredde = styled.div<{ $maxWidth: number }>`
    max-width: ${({ $maxWidth }) => $maxWidth}px;
`;

interface FaktaFieldsProps<T extends FaktaAktivitet> {
    fakta: T;
    errors: Partial<Record<keyof T, string>>;
    oppdaterFakta: (key: keyof T, nyFakta?: number) => void;
    erLesevisning: boolean;
    alleFelterKanEndres: boolean;
}

export function Faktafelter<T extends FaktaAktivitet>({
    fakta,
    errors,
    oppdaterFakta,
    erLesevisning,
    alleFelterKanEndres,
}: FaktaFieldsProps<T>) {
    return (
        <>
            {Object.entries(fakta).map(([key, value]) => (
                <FeilmeldingMaksBredde $maxWidth={140} key={key}>
                    <TextField
                        erLesevisning={erLesevisning}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={value ?? ''}
                        onChange={(event) =>
                            oppdaterFakta(key as keyof T, tilHeltall(event.target.value))
                        }
                        size="small"
                        error={errors[key as keyof T]}
                        autoComplete="off"
                        readOnly={!alleFelterKanEndres}
                    />
                </FeilmeldingMaksBredde>
            ))}
        </>
    );
}
