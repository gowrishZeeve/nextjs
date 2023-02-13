import { globalConfig } from '@/config/appConfig';

class CloudInfo {
    static getCloudById=(val: string | number) => {
      if (globalConfig.config) {
        return globalConfig.config.clouds[val];
      }
      return '';
    }

    static getInfraDetails(key:string):{cloudId: string, managedHosting: boolean}|string {
      if (globalConfig.config) {
        const { infraTypes } = globalConfig.config;
        return infraTypes[key];
      }
      return '';
    }
}

export default CloudInfo;