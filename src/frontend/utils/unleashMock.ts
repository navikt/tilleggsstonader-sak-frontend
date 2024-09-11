import { IToggle } from 'unleash-proxy-client';

import { Toggle } from './toggles';

/**
 * Feature flags er automatisk enabled, hvis man ønsker å overskreve de brukes eks
 * [Toggle.KAN_OPPRETTE_REVURDERING]: false,
 */
const featureFlags: Partial<Record<Toggle, boolean>> = {
    [Toggle.KAN_OPPRETTE_REVURDERING]: true,
};

export const mockFlags: IToggle[] = Object.values(Toggle).map((toggle) => {
    const enabled = featureFlags[toggle] ?? true;

    return {
        name: toggle,
        enabled: enabled,
        variant: { name: toggle, enabled: enabled },
        impressionData: false,
    };
});
