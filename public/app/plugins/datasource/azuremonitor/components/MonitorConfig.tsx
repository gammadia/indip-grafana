import React, { useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';

import { SelectableValue } from '@grafana/data';
import { config } from '@grafana/runtime';

import { getCredentials, updateCredentials } from '../credentials';
import { AzureDataSourceSettings, AzureCredentials } from '../types';

import { AzureCredentialsForm } from './AzureCredentialsForm';
import { DefaultSubscription } from './DefaultSubscription';

const azureClouds: SelectableValue[] = [
  { value: 'azuremonitor', label: 'Azure' },
  { value: 'govazuremonitor', label: 'Azure US Government' },
  { value: 'chinaazuremonitor', label: 'Azure China' },
];

export interface Props {
  options: AzureDataSourceSettings;
  updateOptions: (optionsFunc: (options: AzureDataSourceSettings) => AzureDataSourceSettings) => void;
  getSubscriptions: () => Promise<Array<SelectableValue<string>>>;
}

export const MonitorConfig = (props: Props) => {
  const { updateOptions, getSubscriptions, options } = props;
  const [subscriptions, setSubscriptions] = useState<Array<SelectableValue<string>>>([]);
  const credentials = useMemo(() => getCredentials(props.options), [props.options]);

  const onCredentialsChange = (credentials: AzureCredentials, subscriptionId?: string): void => {
    if (!subscriptionId) {
      setSubscriptions([]);
    }
    updateOptions((options) =>
      updateCredentials({ ...options, jsonData: { ...options.jsonData, subscriptionId } }, credentials)
    );
  };

  const onSubscriptionsChange = (receivedSubscriptions: Array<SelectableValue<string>>) =>
    setSubscriptions(receivedSubscriptions);

  const onSubscriptionChange = (subscriptionId?: string) =>
    updateOptions((options) => ({ ...options, jsonData: { ...options.jsonData, subscriptionId } }));

  // The auth type needs to be set on the first load of the data source
  useEffectOnce(() => {
    if (!options.jsonData.authType || !credentials.authType) {
      onCredentialsChange(credentials, options.jsonData.subscriptionId);
    }
  });

  return (
    <>
      <AzureCredentialsForm
        managedIdentityEnabled={config.azure.managedIdentityEnabled}
        workloadIdentityEnabled={config.azure.workloadIdentityEnabled}
        credentials={credentials}
        azureCloudOptions={azureClouds}
        onCredentialsChange={onCredentialsChange}
        disabled={props.options.readOnly}
      >
        <DefaultSubscription
          subscriptions={subscriptions}
          credentials={credentials}
          getSubscriptions={getSubscriptions}
          disabled={props.options.readOnly}
          onSubscriptionsChange={onSubscriptionsChange}
          onSubscriptionChange={onSubscriptionChange}
          options={options.jsonData}
        />
      </AzureCredentialsForm>
    </>
  );
};

export default MonitorConfig;
