import { IToggle } from 'unleash-proxy-client';

import { Toggle } from './toggles';

/**
 * Feature flags er automatisk enabled, hvis man ønsker å overskreve de brukes eks
 * [Toggle.KAN_OPPRETTE_REVURDERING]: false,
 */
const featureFlags: Partial<Record<Toggle, boolean>> = {
    [Toggle.KAN_OPPRETTE_REVURDERING]: true,
};

export const mockFlags: IToggle[] = Object.entries(featureFlags).map(([name, enabled]) => ({
    name: name,
    enabled: enabled,
    variant: { name: name, enabled: enabled },
    impressionData: false,
}));
