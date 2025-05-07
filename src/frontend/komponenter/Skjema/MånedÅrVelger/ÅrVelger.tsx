import React from 'react';

import { Select } from '@navikt/ds-react';

interface ÅrProps {
    år: number | undefined;
    settÅr: (år: number) => void;
    antallÅrFrem: number;
    antallÅrTilbake: number;
    lesevisning?: boolean;
    className?: string;
}

const lagÅrOptions = (år: number | undefined, antallÅrFrem: number, antallÅrTilbake: number) => {
    const gjeldendeÅr = new Date().getFullYear();
    const start = år ? Math.min(år, gjeldendeÅr - antallÅrTilbake) : gjeldendeÅr - antallÅrTilbake;
    const slutt = år ? Math.max(år, gjeldendeÅr + antallÅrFrem) : gjeldendeÅr + antallÅrFrem;
    return range(start, slutt + 1).map((år) => (
        <option value={år} key={år}>
            {år}
        </option>
    ));
};

const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start }, (_, k) => k + start);

export const Årvelger: React.FC<ÅrProps> = ({
    år,
    settÅr,
    antallÅrFrem,
    antallÅrTilbake,
    lesevisning = false,
    className,
}) => {
    const årOptions = lagÅrOptions(år, antallÅrFrem, antallÅrTilbake);

    const oppdaterÅr = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.persist();
        settÅr(parseInt(event.target.value));
    };

    return (
        <Select
            value={år}
            onChange={(event) => oppdaterÅr(event)}
            label={'År'}
            hideLabel
            className={className}
            size="small"
            readOnly={lesevisning}
        >
            <option value="">År</option>
            {årOptions}
        </Select>
    );
};
