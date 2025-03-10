import React, { useEffect, useRef, useState } from 'react';

import { BriefcaseIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';

import { AktivitetHjelpetekst } from './AktivitetHjelpetekst';
import { AktivitetKort } from './AktivitetKortLesevisning/AktivitetKort';
import { EndreAktivitet } from './EndreAktivitet';
import RegisterAktiviteter from './RegisterAktivteter';
import { useApp } from '../../../../context/AppContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import {
    lenkerForskriftAktivitet,
    lenkerParagrafAktivitet,
    lenkerRundskrivAktivitet,
} from '../../lenker';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode/vilkårperiode';

const Aktivitet: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({ grunnlag }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const nyPeriodeRef = useRef<HTMLDivElement>(null);
    const feilmeldingRef = useRef<HTMLDivElement>(null);

    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [aktivitetFraRegister, settAktivitetFraRegister] = useState<Registeraktivitet>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        nullstillUlagretKomponent(UlagretKomponent.AKTIVITET);
        settAktivitetFraRegister(undefined);
    };

    const kanSetteNyRadIRedigeringsmodus = radIRedigeringsmodus === undefined && erStegRedigerbart;

    const scrollTilFeilmelding = () => {
        feilmeldingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const settNyRadIRedigeringsmodus = (id?: string, aktivitetFraRegister?: Registeraktivitet) => {
        if (kanSetteNyRadIRedigeringsmodus) {
            settFeilmelding(undefined);
            settRadIRedigeringsmodus(id || 'nyPeriode');
            settAktivitetFraRegister(aktivitetFraRegister);
            settUlagretKomponent(UlagretKomponent.AKTIVITET);
        } else {
            settFeilmelding(
                'Det er kun mulig redigere en rad om gangen. Lagre eller avbryt pågående redigering.'
            );
            scrollTilFeilmelding();
        }
    };

    useEffect(() => {
        if (radIRedigeringsmodus === 'nyPeriode') {
            nyPeriodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [radIRedigeringsmodus]);

    useEffect(() => {
        // Nødvendig for å trigge scroll ved feilmelding satt før komponent er rendret
        if (feilmelding) {
            scrollTilFeilmelding();
        }
    }, [feilmelding]);

    return (
        <VilkårPanel
            ikon={<BriefcaseIcon />}
            tittel="Aktivitet"
            paragraflenker={lenkerParagrafAktivitet}
            rundskrivlenke={lenkerRundskrivAktivitet}
            forskriftlenker={lenkerForskriftAktivitet}
        >
            <FlexColumn $gap={2}>
                <RegisterAktiviteter
                    grunnlag={grunnlag}
                    leggTilAktivitetFraRegister={(valgtAktivitet: Registeraktivitet) =>
                        settNyRadIRedigeringsmodus(undefined, valgtAktivitet)
                    }
                />

                <FlexColumn>
                    <div>
                        <Label>Aktiviteter knyttet til behandling</Label>
                        <AktivitetHjelpetekst />
                    </div>
                    {aktiviteter.map((aktivitet) => {
                        const registeraktivitet = grunnlag?.aktivitet?.aktiviteter?.find(
                            (registeraktivitet) => registeraktivitet.id === aktivitet.kildeId
                        );

                        return (
                            <React.Fragment key={aktivitet.id}>
                                {aktivitet.id === radIRedigeringsmodus ? (
                                    <EndreAktivitet
                                        aktivitet={aktivitet}
                                        aktivitetFraRegister={registeraktivitet}
                                        avbrytRedigering={fjernRadIRedigeringsmodus}
                                    />
                                ) : (
                                    <AktivitetKort
                                        aktivitet={aktivitet}
                                        aktivitetFraRegister={registeraktivitet}
                                        startRedigering={() =>
                                            settNyRadIRedigeringsmodus(aktivitet.id)
                                        }
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                    {radIRedigeringsmodus === 'nyPeriode' && (
                        <div ref={nyPeriodeRef}>
                            <EndreAktivitet
                                avbrytRedigering={fjernRadIRedigeringsmodus}
                                aktivitetFraRegister={aktivitetFraRegister}
                            />
                        </div>
                    )}

                    <Feilmelding ref={feilmeldingRef} feil={feilmelding} />

                    {kanSetteNyRadIRedigeringsmodus && erStegRedigerbart && (
                        <Button
                            onClick={() => settNyRadIRedigeringsmodus()}
                            size="xsmall"
                            style={{ maxWidth: 'fit-content' }}
                            variant="secondary"
                            icon={<PlusCircleIcon />}
                        >
                            Legg til aktivitet manuelt
                        </Button>
                    )}
                </FlexColumn>
            </FlexColumn>
        </VilkårPanel>
    );
};

export default Aktivitet;
