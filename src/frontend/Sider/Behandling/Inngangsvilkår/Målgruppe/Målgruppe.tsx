import React, { useEffect, useRef, useState } from 'react';

import { CardIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';

import EndreMålgruppe from './EndreMålgruppe';
import { MålgruppeHjelpetekst } from './MålgruppeHjelpetekst';
import { MålgruppeKort } from './MålgruppeKort';
import RegisterYtelser from './RegisterYtelser';
import { useApp } from '../../../../context/AppContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import {
    lenkerForskriftMålgruppe,
    lenkerParagrafMålgruppe,
    lenkerRundskrivMålgruppe,
} from '../../lenker';
import {
    VilkårperioderGrunnlag,
    YtelseGrunnlagPeriode,
} from '../typer/vilkårperiode/vilkårperiode';

const Målgruppe: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({ grunnlag }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { målgrupper } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const nyPeriodeRef = useRef<HTMLDivElement>(null);
    const feilmeldingRef = useRef<HTMLDivElement>(null);

    const [radSomRedigeres, settRadSomRedigeres] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [periodeFraRegister, settPeriodeFraRegister] = useState<
        YtelseGrunnlagPeriode | undefined
    >(undefined);

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadSomRedigeres(undefined);
        settPeriodeFraRegister(undefined);
        nullstillUlagretKomponent(UlagretKomponent.MÅLGRUPPE);
    };

    const kanSetteNyRadIRedigeringsmodus = radSomRedigeres === undefined && erStegRedigerbart;

    const scrollTilFeilmelding = () => {
        nyPeriodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const settRadIRedigeringsmodus = (id?: string, registrertPeriode?: YtelseGrunnlagPeriode) => {
        if (kanSetteNyRadIRedigeringsmodus) {
            settFeilmelding(undefined);
            settRadSomRedigeres(id || 'nyPeriode');
            settPeriodeFraRegister(registrertPeriode);
            settUlagretKomponent(UlagretKomponent.MÅLGRUPPE);
        } else {
            settFeilmelding(
                'Det er kun mulig redigere en rad om gangen. Lagre eller avbryt pågående redigering.'
            );
            scrollTilFeilmelding(); // Nødvendig å sette fokus her fordi hvis feilmelding alt vises vil ikke ueffecten trigges
        }
    };

    useEffect(() => {
        if (radSomRedigeres) {
            feilmeldingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [radSomRedigeres]);

    useEffect(() => {
        // Nødvendig for å trigge scroll ved feilmelding satt før komponent er rendret
        if (feilmelding) {
            scrollTilFeilmelding();
        }
    }, [feilmelding]);

    return (
        <VilkårPanel
            ikon={<CardIcon />}
            tittel="Målgruppe"
            paragraflenker={lenkerParagrafMålgruppe}
            rundskrivlenke={lenkerRundskrivMålgruppe}
            forskriftlenker={lenkerForskriftMålgruppe}
        >
            <FlexColumn $gap={2}>
                <RegisterYtelser
                    grunnlag={grunnlag}
                    lagRadForPeriode={(valgtPeriode: YtelseGrunnlagPeriode) =>
                        settRadIRedigeringsmodus(undefined, valgtPeriode)
                    }
                />
                <FlexColumn>
                    <div>
                        <Label>Målgrupper knyttet til denne behandlingen</Label>
                        <MålgruppeHjelpetekst />
                    </div>

                    {målgrupper.map((målgruppe) => (
                        <React.Fragment key={målgruppe.id}>
                            {målgruppe.id === radSomRedigeres ? (
                                <EndreMålgruppe
                                    målgruppe={målgruppe}
                                    avbrytRedigering={fjernRadIRedigeringsmodus}
                                />
                            ) : (
                                <MålgruppeKort
                                    målgruppe={målgruppe}
                                    startRedigering={() => settRadIRedigeringsmodus(målgruppe.id)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    {radSomRedigeres === 'nyPeriode' && (
                        <div ref={nyPeriodeRef}>
                            <EndreMålgruppe
                                avbrytRedigering={fjernRadIRedigeringsmodus}
                                registerYtelsePeriode={periodeFraRegister}
                            />
                        </div>
                    )}

                    <Feilmelding ref={feilmeldingRef} feil={feilmelding} />

                    {kanSetteNyRadIRedigeringsmodus && (
                        <Button
                            onClick={() => settRadIRedigeringsmodus()}
                            size="xsmall"
                            style={{ maxWidth: 'fit-content' }}
                            variant="secondary"
                            icon={<PlusCircleIcon />}
                        >
                            Legg til ny målgruppe
                        </Button>
                    )}
                </FlexColumn>
            </FlexColumn>
        </VilkårPanel>
    );
};

export default Målgruppe;
