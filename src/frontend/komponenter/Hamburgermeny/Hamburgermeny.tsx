import React, { FC } from 'react';

import { MenuHamburgerIcon, TrashIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

export interface MenuGroup {
    tekst: string;
    items: MenuItem[];
}

// Deler av ActionMenuItemProps
export interface MenuItem {
    tekst: string;
    onSelect: () => void;
    icon?: React.ReactNode;
    variant?: 'danger';
}

export interface Props {
    groups: MenuGroup[];
    className?: string;
}

export const henleggMenuItem = (onSelect: () => void): MenuItem => {
    return {
        tekst: 'Henlegg',
        onSelect: onSelect,
        variant: 'danger',
        icon: <TrashIcon />,
    };
};

export const Hamburgermeny: FC<Props> = ({ groups }) => {
    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button variant={'tertiary-neutral'} size={'small'} icon={<MenuHamburgerIcon />} />
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                {groups.length === 0 && <ActionMenu.Item>Ingen valg</ActionMenu.Item>}
                {groups.map((group) => (
                    <ActionMenu.Group key={group.tekst} label={group.tekst}>
                        {group.items.map((item) => (
                            <ActionMenu.Item
                                key={item.tekst}
                                onSelect={item.onSelect}
                                variant={item.variant}
                            >
                                {item.tekst}
                            </ActionMenu.Item>
                        ))}
                    </ActionMenu.Group>
                ))}
            </ActionMenu.Content>
        </ActionMenu>
    );
};
