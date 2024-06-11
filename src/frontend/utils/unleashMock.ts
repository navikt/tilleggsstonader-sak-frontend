import { IToggle } from 'unleash-proxy-client';

/**
 * Feature flags er automatisk enabled, hvis man ønsker å overskreve de brukes eks
 * 'sak.kan-opprette-revurdering': false,
 */
const featureFlags: { [name: string]: boolean } = {
    'sak.kan-opprette-revurdering': true,
};

export const mockFlags: IToggle[] = Object.entries(featureFlags).map(([name, enabled]) => ({
    name: name,
    enabled: enabled,
    variant: { name: name, enabled: enabled },
    impressionData: false,
}));
