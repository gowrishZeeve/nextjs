// ****************************************************************************************************************************************
export interface AddNodePayload {
  networkId: string;
  credId: string;
  // userId: string;
  cloud: string;
  region: string | number;
  managedHosting: boolean;
  planCode: string;
  addOnCodes: string[];
  instanceArray: {
    type: string;
    name: string;
    blockchainInputs: {
      apis: string[];
      http: boolean;
      ws: boolean;
      authUser: string;
      authPassword: string;
      // email: string;
      network: string;
      syncMode: string;
      gcMode: string;
      ipcRPC: boolean;
      txLookupLimit: number;
    };
  }[];
  workspaceId: string;
  projectId: string;
}

// ****************************************************************************************************************************************
export interface CreateNetworkPayload {
  networkName: string;
  credId: string;
  cloud: string;
  // cloudName: string,
  region: string | number;
  workspaceId: string;
  deploymentType: string;
  managedHosting: boolean;
  projectId: string;
  planCode: string;
  addOnCodes: string[];
  instanceArray: {
    name: string;
    type: string;
    blockchainInputs: {
      apis: string[];
      http: boolean;
      ws: boolean;
      authUser: string;
      authPassword: string;
      // email: string;
      network: string;
      syncMode: string;
      gcMode: string;
      ipcRPC: boolean;
      txLookupLimit: number;
    };
  }[];
}

export interface CreateSubscriptionPayload {
  quantity: number;
  addOnCodes: string[];
  planCode: string;
}

export interface UpdateEndpointNamePayload {
  id: string;
  name: string;
}

export interface UpdateSecurityPayload {
  id: string;
  securityEnabled: boolean;
  jwtEnabled?: boolean;
  jwtName?: string;
  jwtKey?: string;
}

export interface CreateEndpointPaload {
  name: string;
  workspaceId: string;
  userPlan: string;
  userAddOns: string[];
  networkType: string;
  securityEnabled: boolean;
  jwt?: {
    enabled: boolean;
    name: string;
    publicKey: string;
  };
}
