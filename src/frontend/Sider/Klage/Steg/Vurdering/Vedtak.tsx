import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Heading, Select } from '@navikt/ds-react';

import styles from './Vedtak.module.css';
import { Vurderingsfelter } from './vurderingsfelter';
import { VedtakValg } from './vurderingValg';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';

interface IVedtak {
    settVedtak: Dispatch<SetStateAction<Vurderingsfelter>>;
    vedtakValgt?: VedtakValg;
    vedtakValgmuligheter: Record<string, string>;
    endring: (komponentId: string) => void;
}

export const Vedtak: React.FC<IVedtak> = ({
    settVedtak,
    vedtakValgt,
    vedtakValgmuligheter,
    endring,
}) => {
    const oppdaterVedtak = (nyttValg: string) => {
        settVedtak(
            (tidligereTilstand: Vurderingsfelter) =>
                ({
                    ...tidligereTilstand,
                    vedtak: nyttValg,
                    årsak: undefined,
                    hjemler: undefined,
                }) as Vurderingsfelter
        );
    };

    const { settVurderingEndret } = useKlagebehandling();
    return (
        <div className={styles.vedtak}>
            <Heading spacing size="medium" level="5">
                Vedtak
            </Heading>
            <div className={styles.vedtakInnhold}>
                <Select
                    value={vedtakValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        oppdaterVedtak(e.target.value);
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(vedtakValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {vedtakValgmuligheter[valg]}
                        </option>
                    ))}
                </Select>
            </div>
        </div>
    );
};
