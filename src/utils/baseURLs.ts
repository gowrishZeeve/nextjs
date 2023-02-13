/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { globalConfig } from "@/config/appConfig";

class Urls {
  static getCreateNetworkUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/network/create`;
    }
    return '';
  }

  static getInappNotificationsUrl(token: string): string {
    let url = '';
    if (globalConfig.config && globalConfig.config.InAppNotificationUrl) {
      url = globalConfig.config.InAppNotificationUrl;
      url = `${url}?token=${token}`;
      return url;
    }
    return url;
  }

  static getSignInUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.authPublicUrl;
      return `${url}/login`;
    }
    return '';
  }

  static getAuthUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.authPublicUrl;
      return url;
    }
    return '';
  }

  static getZdexerURL(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.zdexerPortalUrl;
      return url;
    }
    return '';
  }

  static getAllNodesUrl(id: string | number): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/network/${id}/nodes`;
    }
    return '';
  }

  static getNodeInfo(id: string, nodeId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/network/${id}/node/${nodeId}/status`;
    }
    return '';
  }

  static getContactDetails(): { email: string, helpdeskURL: string } {
    if (globalConfig.config) {
      const { email, helpdeskURL } = globalConfig.config.contacts;
      return { email, helpdeskURL };
    }
    return { email: '', helpdeskURL: '' };
  }

  static getBuyEndpointUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/endpoint/buy`;
    }
    return '';
  }

  static getBackendUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return url;
    }
    return '';
  }

  static getAccessTokenUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.authPublicUrl;
      return `${url}/getNewToken`;
    }
    return '';
  }

  static getDashboardUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/dashboard`;
    }
    return '';
  }

  static getWorkspaceList(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appBackendApiUrl;
      return `${url}/workspace/list`;
    }
    return '';
  }

  static getWorkspaceUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/workspace`;
    }
    return '';
  }

  static getMarketplaceUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/marketplace`;
    }
    return '';
  }

  static getStakingMarketplaceUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/marketplace/staking-nodes`;
    }
    return '';
  }

  static getMyAccountUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/Account`;
    }
    return '';
  }

  static getPipelineUrl(networkId: number | string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/pipelines/${networkId}`;
    }
    return '';
  }

  static getSummaryUrl(networkId: number | string, jobId: number | string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/pipelines/${networkId}/${jobId}`;
    }
    return '';
  }

  static getArtifactFiles(networkId: number | string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/artifact/${networkId}`;
    }
    return '';
  }

  static getCredId(id: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appBackendApiUrl;
      return `${url}/cloud/authorized?cloudId=${id}`;
    }
    return '';
  }

  static getToWorkspace(str: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}${str}`;
    }
    return '';
  }

  static getCloudList(): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.appBackendApiUrl;
      return `${BASE_URL}/cloud/list`;
    }
    return '';
  }

  static getCloudRegion(cloudId: number | string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appBackendApiUrl;
      return `${url}/cloud/regions/${cloudId}`;
    }
    return '';
  }

  static getUserInfo(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appBackendApiUrl;
      return `${url}/dashboard/user-info`;
    }
    return '';
  }

  static deleteNetworkById(networkId: string | number): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.protocolBackendApiUrl;
      return `${BASE_URL}/network/${networkId}`;
    }
    return '';
  }

  static getAllNetworkUrl(): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.appFrontendUrl;
      return `${BASE_URL}/allNetwork`;
    }
    return '';
  }

  static getAllStakingNetworkUrl(): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.appFrontendUrl;
      return `${BASE_URL}/network/staking-nodes`;
    }
    return '';
  }

  static addNodeUrl(id: string | number): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/network/${id}/node/add`;
    }
    return '';
  }

  static getRpcDetail(netId: string, nodeId: string): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.protocolBackendApiUrl;
      return `${BASE_URL}/network/${netId}/node/${nodeId}`;
    }
    return '';
  }

  static getNetworkListUrl(val: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      const type = 'dedicated';
      if (val === 'all') {
        return `${url}/network/defaults?nodeType=${type}`;
      }

      return `${url}/network/defaults?network=${val}&nodeType=${type}`;
    }
    return '';
  }

  static getNetworkDetail(id: string | number): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/network/${id}`;
    }
    return '';
  }

  static deleteNodeUrl(networkId: string, nodeId: string): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.protocolBackendApiUrl;
      return `${BASE_URL}/network/${networkId}/node/${nodeId}`;
    }
    return '';
  }

  static getItemCode(code: string): string {
    if (globalConfig.config) {
      const { itemCode } = globalConfig.config;
      return itemCode[code];
    }
    return '';
  }

  static getSubscription(value: string): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.protocolBackendApiUrl;
      return `${BASE_URL}/payment/subscribe?usedFor=${value}`;
    }
    return '';
  }

  static getPlans(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/payment/priceList?usedFor=dedicatedNodes`;
    }
    return '';
  }

  static getZeeveManagedItemCode(): string {
    if (globalConfig.config) {
      return globalConfig.config.zeeveManagedCloud;
    }
    return '';
  }

  static getDeploymentId(): string {
    if (globalConfig.config) {
      return globalConfig.config.deploymentId;
    }
    return '';
  }

  static getAvailableCount(params?: string[]): string {
    if (globalConfig.config) {
      const arrStr = encodeURIComponent(JSON.stringify(params));
      const id = globalConfig.config.protocolId;
      return `${globalConfig.config.appBackendApiUrl}/configuration/node?id=${id}&filter=${arrStr}`;
    }
    return '';
  }

  static getEnvironment(): string {
    if (globalConfig.config) {
      return globalConfig.config.environment;
    }
    return '';
  }

  static getInstanceTypes(id: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/cloud/instance-types/${id}`;
    }
    return '';
  }

  /**
    Endpoints Urls
  * */

  static getEndpointDetailsUrl(endpointId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/${endpointId}`;
    }
    return '';
  }

  static getUpdateEndpointNameOrSecurityUrl(type: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/update?updateFor=${type}`;
    }
    return '';
  }

  static getCreateEndpointUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/create`;
    }
    return '';
  }

  static isSharedApiEnabled(): boolean {
    if (globalConfig.config) {
      return globalConfig.config.sharedApiEnabled;
    }
    return false;
  }

  static getEndpointsUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.appFrontendUrl;
      return `${url}/endpoints`;
    }
    return '';
  }

  static getPlansForSharedNodes(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/payment/priceList?usedFor=sharedNodes`;
    }
    return '';
  }

  static getEndpointHttpUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.endpointUrl;
      return url.http;
    }
    return '';
  }

  static getEndpointWssUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.endpointUrl;
      return url.wss;
    }
    return '';
  }

  static getConsumptionDetailUrl(subscriptionId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/subscription/${subscriptionId}`;
    }
    return '';
  }

  static getEndpointMatricsUrl(endpointId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/basics/${endpointId}`;
    }
    return '';
  }

  static getEndpointMethodCallUrl(endpointId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/method-breakdown/${endpointId}`;
    }
    return '';
  }

  static getEndpointRecentMethodCUrl(endpointId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/endpoint/recent-request/${endpointId}`;
    }
    return '';
  }

  /**
    zdfs Urls
  * */
  static getZdfsPurchaseUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.zdfsUrl;
      return `${url}/purchase-subscription`;
    }
    return '';
  }

  static getZdfsManageUrl(): string {
    if (globalConfig.config) {
      const url = globalConfig.config.zdfsUrl;
      return url;
    }
    return '';
  }

  static getAnalyticsBackendUrl(): string {
    if (globalConfig.config) {
      const BASE_URL = globalConfig.config.appFrontendUrl;
      return `${BASE_URL}/analytics/api`;
    }
    return '';
  }

  static getBeaconNodeSyncingStatusAPI(networkId: string, nodeId: string): string {
    if (globalConfig.config) {
      const url = globalConfig.config.protocolBackendApiUrl;
      return `${url}/network/${networkId}/node/${nodeId}/beacon-sync-status`;
    }
    return '';
  }
}
export default Urls;