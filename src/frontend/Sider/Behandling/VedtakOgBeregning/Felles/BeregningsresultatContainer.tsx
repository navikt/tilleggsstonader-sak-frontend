import React from 'react';

import { VStack, VStackProps } from '@navikt/ds-react';

import styles from './BeregningsresultatContainer.module.css';
import { classNames } from '../../../../utils/classNames';

export const BeregningsresultatContainer: React.FC<VStackProps> = ({ className, ...props }) => {
    return <VStack className={classNames([styles.container, className])} {...props} />;
};
