import { getData, postData, deleteData, updateData } from "@/services/apiCalls";
import Urls from "@/utils/baseURLs";
import {
  AddNodePayload,
  CreateNetworkPayload,
  UpdateEndpointNamePayload,
  UpdateSecurityPayload,
  CreateEndpointPaload,
  CreateSubscriptionPayload,
} from "./payloadTypes";

export const getNetworkList = async (networkType: string) => {
  const res = await getData(Urls.getNetworkListUrl(networkType));
  return res;
};

export const getWorkspaceListData = async () => {
  const res = await getData(Urls.getWorkspaceList());
  return res;
};

export const getUserDetails = async () => {
  const res = await getData(Urls.getUserInfo());
  return res;
};

export const getCloudRegionData = async (id: string | number) => {
  const res = await getData(Urls.getCloudRegion(id));
  return res;
};

export const getCloudListData = async () => {
  const res = await getData(Urls.getCloudList());
  return res;
};

export const getCredIdData = async (id: string) => {
  const res = await getData(Urls.getCredId(id));
  return res;
};

export const getNetworkDetailData = async (networkId: string | number) => {
  const res = await getData(Urls.getNetworkDetail(networkId));
  return res;
};

// For Single Node Add
export const addNodeData = async (
  payload: AddNodePayload,
  networkId: string
) => {
  const res = await postData(Urls.addNodeUrl(networkId), payload);
  return res;
};

export const createNetwork = async (payload: CreateNetworkPayload) => {
  const res = await postData(Urls.getCreateNetworkUrl(), payload);
  return res;
};

export const getAccessToken = async () => {
  const res = await getData(Urls.getAccessTokenUrl());
  return res;
};

export const getCredIdsData = async (id: string) => {
  const res = await getData(Urls.getCredId(id));
  return res;
};

export const getInstanceTypesData = async (id: string) => {
  const res = await getData(Urls.getInstanceTypes(id));
  return res;
};

export const getAllNodesData = async (id: string | number) => {
  const res = await getData(Urls.getAllNodesUrl(id));
  return res;
};

export const deleteTheNetwork = async (networkId: string | number) => {
  const res = await deleteData(Urls.deleteNetworkById(networkId));
  return res;
};

export const deleteTheNode = async (netId: string, nodeId: string) => {
  const res = await deleteData(Urls.deleteNodeUrl(netId, nodeId));
  return res;
};

export const getRpcDetailData = async (networkId: string, id: string) => {
  const res = await getData(Urls.getRpcDetail(networkId, id));
  return res;
};

export const getBlockHeightData = async (networkId: string, id: string) => {
  const res = await getData(Urls.getNodeInfo(networkId, id));
  return res;
};

export const getEndpointDetailsData = async (endpointId: string) => {
  const res = await getData(Urls.getEndpointDetailsUrl(endpointId));
  return res;
};

export const getSubsComQuotaData = async (subscriptionId: string) => {
  const res = await getData(Urls.getConsumptionDetailUrl(subscriptionId));
  return res;
};

export const deleteTheEndpoint = async (endpointId: string) => {
  const res = await deleteData(Urls.getEndpointDetailsUrl(endpointId));
  return res;
};

export const updateEndpointName = async (
  payload: UpdateEndpointNamePayload,
  type: string
) => {
  const res = await updateData(
    Urls.getUpdateEndpointNameOrSecurityUrl(type),
    payload
  );
  return res;
};

export const updateSecurity = async (
  payload: UpdateSecurityPayload,
  type: string
) => {
  const res = await updateData(
    Urls.getUpdateEndpointNameOrSecurityUrl(type),
    payload
  );
  return res;
};

export const createEndpoint = async (payload: CreateEndpointPaload) => {
  const res = await postData(Urls.getCreateEndpointUrl(), payload);
  return res;
};

export const createSubscription = async (
  payload: CreateSubscriptionPayload,
  queryValue: string
) => {
  const res = await postData(Urls.getSubscription(queryValue), payload);
  return res;
};

export const getPlansForSharedNodesData = async () => {
  const res = await getData(Urls.getPlansForSharedNodes());
  return res;
};
export const getSummaryData = async (endpointId: string) => {
  const res = await getData(Urls.getEndpointMatricsUrl(endpointId));
  return res;
};

export const getMethodCallData = async (endpointId: string) => {
  const res = await getData(Urls.getEndpointMethodCallUrl(endpointId));
  return res;
};

export const getRecentMethodData = async (endpointId: string) => {
  const res = await getData(Urls.getEndpointRecentMethodCUrl(endpointId));
  return res;
};
