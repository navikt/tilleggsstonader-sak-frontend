import { UnleashClient } from 'unleash-proxy-client';

/**
 * Feature flags er automatisk enabled, hvis man ønsker å overskreve de brukes eks
 * 'sak.kan-opprette-revurdering': false,
 */
const featureFlags: { [key: string]: boolean } = {
    'sak.kan-opprette-revurdering': true,
};

export const mockUnleashServer: UnleashClient = {
    isEnabled: (toggleName: string): boolean => featureFlags[toggleName] ?? true,
    // @ts-ignore
    on: () => {},
    // @ts-ignore
    off: () => {},
    // @ts-ignore
    start: () => {},
    stop: () => {},
};
