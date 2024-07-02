import React, { FC } from 'react';

import { Action as HistoryAction } from '@remix-run/router/history';
import { Location } from 'react-router-dom';
import ReactRouterPrompt from 'react-router-prompt';

import { ModalWrapper } from './ModalWrapper';
import { useApp } from '../../context/AppContext';
import { UlagretKomponent } from '../../hooks/useUlagredeKomponenter';

/**
 * Argumenten i BlockerFunction
 */
interface BlockerFunctionArguments {
    currentLocation: Location;
    nextLocation: Location;
    historyAction: HistoryAction;
}

const behandlingKomponenterSomKanBytteFane: UlagretKomponent[] = [UlagretKomponent.FATTE_VEDTAK];

/**
 * Fjerner komponenter som kan bytte fane fra ulagerede komponenter å sjekker om noen er igjen.
 * @param ulagradeKomponenter
 */
const harKomponenterSomIkkeKanBytteFane = (ulagradeKomponenter: Set<string>): boolean => {
    const copy = new Set(ulagradeKomponenter);
    behandlingKomponenterSomKanBytteFane.forEach((komponent) => copy.delete(komponent));
    return copy.size > 0;
};

const harBehandlingKomponentSomKanBytteFane = (ulagradeKomponenter: Set<string>) =>
    behandlingKomponenterSomKanBytteFane.every((komponent) => ulagradeKomponenter.has(komponent));

/**
 * Hvis nextLocation ikke begynner med `/behandling/` så betyr det at man navigerer bort fra behandling-contexten.
 * Eller at man lukker vindu, tab eller trigger `useBeforeUnload` i
 * https://github.com/sshyam-gupta/react-router-prompt/blob/main/src/hooks/use-prompt.ts#L34
 */
const bytterTilAnnenFaneEnnBehandling = (args: BlockerFunctionArguments | undefined) =>
    !(args?.nextLocation?.pathname ?? '').startsWith('/behandling/');

/**
 * Viser modal i tilfelle man prøver å navigere til en annen side når det finnes ulagrede komponenter.
 * Viser også en alert på engelsk hvis man prøver å lukke vinduet når det finnes ulagede komponenter.
 *
 * Bruker https://github.com/sshyam-gupta/react-router-prompt som bygger på
 * https://reactrouter.com/en/main/hooks/use-blocker
 */
const UlagredeKomponenterModal: FC = () => {
    const { nullstillUlagredeKomponenter, ulagradeKomponenter } = useApp();

    const harUlagradeKomponenter = ulagradeKomponenter.size > 0;

    return (
        <ReactRouterPrompt
            when={(args?: BlockerFunctionArguments) => {
                if (!harUlagradeKomponenter) {
                    return false;
                }
                if (harKomponenterSomIkkeKanBytteFane(ulagradeKomponenter)) {
                    return true;
                }
                return (
                    harBehandlingKomponentSomKanBytteFane(ulagradeKomponenter) &&
                    bytterTilAnnenFaneEnnBehandling(args)
                );
            }}
        >
            {({ isActive, onConfirm, onCancel }) => (
                <ModalWrapper
                    tittel={
                        'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden'
                    }
                    visModal={isActive}
                    onClose={onCancel}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: onCancel,
                            tekst: 'Gå tilbake for å lagre',
                        },
                        lukkKnapp: {
                            onClick: () => {
                                onConfirm();
                                // Hack fordi samtidighet ikke helt fungerer
                                // hvis man kaller nullstill direkte fjenes modalen før onConfirm blir kallet på og man blir ikke sendt videre
                                setTimeout(nullstillUlagredeKomponenter, 10);
                            },
                            tekst: 'Forlat siden',
                        },
                    }}
                />
            )}
        </ReactRouterPrompt>
    );
};

export default UlagredeKomponenterModal;
