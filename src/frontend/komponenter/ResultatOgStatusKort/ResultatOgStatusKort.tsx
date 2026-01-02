import React from 'react';

import { Detail, HStack } from '@navikt/ds-react';

import styles from './ResultatOgStatusKort.module.css';
import { useBehandling } from '../../context/BehandlingContext';
import { erAktivitet } from '../../Sider/Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { Aktivitet } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { Målgruppe } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { VilkårBase, Vilkårsresultat } from '../../Sider/Behandling/vilkår';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { classNames } from '../../utils/classNames';
import { HvittVilkårsresultatIkon } from '../Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { Statusbånd } from '../Statusbånd';

export const ResultatOgStatusKort: React.FC<{
    periode: VilkårBase | Aktivitet | Målgruppe | undefined;
    redigeringKnapp?: React.ReactNode;
    redigeres?: boolean;
    children: React.ReactNode;
    footer?: React.ReactNode;
}> = ({ periode, redigeringKnapp, children, redigeres = false, footer }) => {
    const { behandling } = useBehandling();

    const skalViseStatus =
        behandling.type === BehandlingType.REVURDERING &&
        periode?.status !== undefined &&
        !redigeres;

    // Vises kun på aktiviteter
    const kildeId = periode && erAktivitet(periode) ? periode.kildeId : undefined;

    return (
        <div className={styles.container}>
            {skalViseStatus && <Statusbånd status={periode.status} />}
            <div
                className={classNames([
                    styles.resultatMarg,
                    utledFarge(periode?.resultat, redigeres),
                ])}
            >
                {periode && !redigeres && (
                    <HvittVilkårsresultatIkon vilkårsresultat={periode?.resultat} />
                )}
            </div>
            <div className={`${styles.innholdContainer} ${redigeres ? styles.redigeres : ''}`}>
                {children}
                {footer}
            </div>
            <HStack gap="4" className={styles.redigeringsknappContainer}>
                {kildeId && <Detail>ID: {kildeId}</Detail>}
                {redigeringKnapp}
            </HStack>
        </div>
    );
};

function utledFarge(
    resultat: VilkårPeriodeResultat | Vilkårsresultat | undefined,
    redigeres: boolean
) {
    if (redigeres || resultat === undefined) {
        return styles.resultatFargeInfo;
    }

    switch (resultat) {
        case 'OPPFYLT':
        case 'AUTOMATISK_OPPFYLT':
            return styles.resultatFargeSuccess;

        case 'IKKE_OPPFYLT':
            return styles.resultatFargeDanger;

        case 'IKKE_VURDERT':
        case 'IKKE_TATT_STILLING_TIL':
            return styles.resultatFargeWarning;

        case 'SLETTET':
            return styles.resultatFargeNeutral;
    }

    return styles.resultatFargeDefault;
}
