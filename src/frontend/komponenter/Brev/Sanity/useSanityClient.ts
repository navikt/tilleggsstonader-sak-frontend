import { useMemo } from 'react';

import { type ClientConfig, createClient } from '@sanity/client';
import { format } from 'date-fns';

import { erProd } from '../../../utils/miljø';

const dataset = 'production';
export const useSanityClient = (brukDrafts: boolean) => {
    const sanityClient = useMemo(() => {
        const config: ClientConfig = {
            projectId: 's0grjk9v',
            dataset: dataset,
            useCdn: erProd(),
            apiVersion: format(new Date(), 'yyyy-MM-dd'), // Nyeste api
            perspective: brukDrafts ? 'drafts' : undefined,
        };
        return createClient(config);
    }, [brukDrafts]);

    return sanityClient;
};
