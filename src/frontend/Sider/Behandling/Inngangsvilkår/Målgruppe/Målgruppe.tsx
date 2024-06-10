import React, { useState } from 'react';

import { CardIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';

import EndreMålgruppeRad from './EndreMålgruppeRad';
import { MålgruppeHjelpetekst } from './MålgruppeHjelpetekst';
import RegisterYtelser from './RegisterYtelser';
import { useApp } from '../../../../context/AppContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { paragraflenkerMålgruppe, rundskrivMålgruppe } from '../../lenker';
import { VilkårperioderGrunnlag, YtelseGrunnlagPeriode } from '../typer/vilkårperiode';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Målgruppe: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({ grunnlag }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { målgrupper } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

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
        }
    };

    return (
        <VilkårPanel
            ikon={<CardIcon />}
            tittel="Målgruppe"
            paragraflenker={paragraflenkerMålgruppe}
            rundskrivlenke={rundskrivMålgruppe}
        >
            <FlexColumn gap={2}>
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
                                <EndreMålgruppeRad
                                    målgruppe={målgruppe}
                                    avbrytRedigering={fjernRadIRedigeringsmodus}
                                />
                            ) : (
                                <VilkårperiodeRad
                                    vilkårperiode={målgruppe}
                                    startRedigering={() => settRadIRedigeringsmodus(målgruppe.id)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    {radSomRedigeres === 'nyPeriode' && (
                        <EndreMålgruppeRad
                            avbrytRedigering={fjernRadIRedigeringsmodus}
                            registerYtelsePeriode={periodeFraRegister}
                        />
                    )}

                    <Feilmelding>{feilmelding}</Feilmelding>

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
