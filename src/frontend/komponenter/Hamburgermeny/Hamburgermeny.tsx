import React, { FC } from 'react';

import { HourglassTopFilledIcon, MenuHamburgerIcon, TrashIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

import { ModiaPersonoversiktLenke } from './Lenker/ModiaPersonoversiktLenke';

export interface Props {
    children?: React.ReactNode;
}

export const Hamburgermeny: FC<Props> = ({ children }) => {
    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button variant={'secondary'} size={'small'} icon={<MenuHamburgerIcon />} />
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                {children ?? <ActionMenu.Item>Ingen valg</ActionMenu.Item>}
            </ActionMenu.Content>
        </ActionMenu>
    );
};

export const SettBehandlingPåVentItem = ({ onSelect }: { onSelect: () => void }) => {
    return (
        <ActionMenu.Item onSelect={onSelect} icon={<HourglassTopFilledIcon />}>
            Sett på vent
        </ActionMenu.Item>
    );
};

export const HenleggMenuItem = ({ onSelect }: { onSelect: () => void }) => {
    return (
        <ActionMenu.Item onSelect={onSelect} icon={<TrashIcon />} variant={'danger'}>
            Henlegg
        </ActionMenu.Item>
    );
};

export const LenkerGroup = ({ ident }: { ident: string }) => {
    return (
        <ActionMenu.Group label={'Lenker'}>
            <ModiaPersonoversiktLenke ident={ident} />
            {/*<GosysLenke />*/}
        </ActionMenu.Group>
    );
};
