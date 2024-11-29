import { createClient, type ClientConfig } from '@sanity/client';
import { format } from 'date-fns';

import { erProd } from '../../../utils/miljø';
export const useSanityClient = () => {
    const dataset = 'production';
    const config: ClientConfig = {
        projectId: 's0grjk9v',
        dataset: dataset,
        useCdn: erProd(),
        apiVersion: format(new Date(), 'yyyy-MM-dd'), // Nyeste api
    };
    return createClient(config);
};
