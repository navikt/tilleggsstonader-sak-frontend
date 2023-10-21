import React, { ReactElement } from 'react';

import { Select } from '@navikt/ds-react';

import { sorterMapperPåNavn } from './filterutils';
import { enhetTilTekstPåString } from '../typer/enhet';
import { Mappe } from '../typer/mappe';
import { OppgaveRequest } from '../typer/oppgave';

interface Props {
    value?: string | number;
    label: string;
    settOppgaveRequest: React.Dispatch<React.SetStateAction<OppgaveRequest>>;
    options: Mappe[];
    erUtenMappe?: boolean;
}

const sorterMappeListerPåEnhetsnummer = (a: [string, Mappe[]], b: [string, Mappe[]]) => {
    if (a[0] > b[0]) return -1;
    else if (a[0] < b[0]) return 1;
    return 0;
};

const tilMapperPerEnhet = (options: Mappe[]) =>
    options.reduce(
        (acc, mappe) => {
            return { ...acc, [mappe.enhetsnr]: [...(acc[mappe.enhetsnr] ?? []), mappe] };
        },
        {} as Record<string, Mappe[]>
    );

const MappeVelger: React.FC<Props> = ({
    value,
    label,
    settOppgaveRequest,
    options,
    erUtenMappe,
}) => {
    const mapperPerEnhet = tilMapperPerEnhet(options);

    const utledValue = () => {
        if (erUtenMappe) return 'uplassert';
        else if (value) return value;
        return '';
    };

    return (
        <Select
            value={utledValue()}
            className="flex-item"
            label={label}
            onChange={(event) => {
                if (event.target.value === 'uplassert') {
                    settOppgaveRequest((prevState: OppgaveRequest) => {
                        return { ...prevState, erUtenMappe: true, mappeId: undefined };
                    });
                } else {
                    settOppgaveRequest((prevState: OppgaveRequest) => {
                        return {
                            ...prevState,
                            erUtenMappe: false,
                            mappeId: parseInt(event.target.value),
                        };
                    });
                }
            }}
        >
            <option value="">Alle</option>
            <option value="uplassert">Uplassert</option>
            {[...Object.entries<Mappe[]>(mapperPerEnhet)]
                .sort(sorterMappeListerPåEnhetsnummer)
                .map<ReactElement>(([val, mapper], index) => {
                    return (
                        <optgroup label={enhetTilTekstPåString[val]} key={index}>
                            {[...mapper].sort(sorterMapperPåNavn).map((mappe) => {
                                return (
                                    <option value={mappe.id} key={mappe.id}>
                                        {mappe.navn}
                                    </option>
                                );
                            })}
                        </optgroup>
                    );
                })}
        </Select>
    );
};

export default MappeVelger;
