import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Link, Table } from '@navikt/ds-react';

import LeggTilAktivitet from './LeggTilAktivitet';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import VilkårPanel from '../../../../komponenter/Vilkår/VilkårPanel';
import { ReglerForVilkår } from '../../../../typer/regel';
import { formaterIsoPeriode } from '../../../../utils/dato';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';
import { Aktivitet } from '../typer';

const Aktivitet: React.FC<{ aktiviteter: Aktivitet[]; regler: ReglerForVilkår }> = ({
    aktiviteter,
    regler,
}) => {
    const { vilkårFeilmeldinger, oppdaterAktivitetVilkårState } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    return (
        <VilkårPanel
            tittel="Aktivitet"
            headerInnhold={
                <>
                    <Link variant="neutral" href="">
                        Paragraf
                    </Link>
                    <Link variant="neutral" href="">
                        Rundskriv
                    </Link>
                </>
            }
        >
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ width: '20px' }} />
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Periode</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {aktiviteter.map((aktivitet) => (
                        <Table.ExpandableRow
                            key={aktivitet.vilkår.id}
                            togglePlacement={'right'}
                            expansionDisabled={aktivitet.vilkår.delvilkårsett.length === 0}
                            content={
                                <>
                                    <Heading size={'xsmall'}>Vilkårsvurdering</Heading>
                                    <EndreVurderingComponent
                                        vilkårType={aktivitet.vilkår.vilkårType}
                                        regler={regler[aktivitet.vilkår.vilkårType].regler}
                                        vilkår={aktivitet.vilkår}
                                        oppdaterVilkår={oppdaterAktivitetVilkårState}
                                    />
                                    <Feilmelding>
                                        {vilkårFeilmeldinger[aktivitet.vilkår.id]}
                                    </Feilmelding>
                                </>
                            }
                        >
                            <Table.DataCell width="max-content">
                                <VilkårsresultatIkon vilkårsresultat={aktivitet.vilkår.resultat} />
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.type}</Table.DataCell>
                            <Table.DataCell>
                                {formaterIsoPeriode(aktivitet.fom, aktivitet.tom)}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
            {skalViseLeggTilPeriode ? (
                <LeggTilAktivitet skjulLeggTilPeriode={() => settSkalViseLeggTilPeriode(false)} />
            ) : (
                <Button
                    onClick={() => settSkalViseLeggTilPeriode((prevState) => !prevState)}
                    size="small"
                    style={{ maxWidth: 'fit-content' }}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny aktivitet
                </Button>
            )}
        </VilkårPanel>
    );
};

export default Aktivitet;
