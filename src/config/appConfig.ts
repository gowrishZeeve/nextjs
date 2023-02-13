export interface DynamicConfig {
  authPublicUrl: string;
  appFrontendUrl: string;
  appBackendApiUrl: string;
  protocolBackendApiUrl: string;
  environment: string;
  protocolId: string;
  sharedApiEnabled: boolean;
  InAppNotificationUrl: string;
  zdfsUrl: string;
  zeeveManagedCloud: string;
  zdexerPortalUrl: string;
  endpointUrl: {
    wss: string;
    http: string;
  };
  contacts: {
    email: string;
    helpdeskURL: string;
  };
  cloudId: string;
  deploymentId: string;
  appTitle: string;
  itemCode: {
    [key: string]: string;
  };
  infraTypes: {
    [key: string]: { cloudId: string; managedHosting: boolean };
  };
  clouds: {
    [key: string]: string;
  };
}
class GlobalConfig {
  config: DynamicConfig | null = null;
}

export const globalConfig = new GlobalConfig();

export const globalConfigUrl = "config.json";
