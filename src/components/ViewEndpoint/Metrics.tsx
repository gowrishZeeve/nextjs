import { useEffect, useState } from "react";
import moment from "moment";
import JSONPretty from "react-json-pretty";
import apiBackendInstance from "../../utils/axios";
import Urls from "@/utils/baseURLs";

import CustomLoader from "@/components/CustomLoader";

type SummaryTypes = {
  successRate: number;
  totalRequest: number;
  invalidRequest: number;
  apiUnits: number;
};

type MethodCallTypes = {
  methodName: string;
  httpCount: number;
  wsCount: number;
};

export type RecentMethodTypes = {
  request: string;
  response: string;
  responseTime: number;
  responseCode: number;
  receivedAt: string;
  errorCode: string | null;
  status: string;
};

interface props {
  id: string;
}
const Metrics = ({ id }: props) => {
  const [summaryData, setSummaryData] = useState({} as SummaryTypes);
  const [methodCallList, setMethodCallList] = useState<MethodCallTypes[] | []>(
    []
  );
  const [recentMethodList, setRecentMethodList] = useState<
    RecentMethodTypes[] | []
  >([]);
  const [loaderShow, setLoaderShow] = useState<boolean>(false);
  const [isCopiedTxt, setIsCopiedTxt] = useState<boolean>(false);

  const callApiSummary = async () => {
    setLoaderShow(true);
    apiBackendInstance
      .get(Urls.getEndpointMatricsUrl(id), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data) {
          setSummaryData(response.data.data);
        }
        setLoaderShow(false);
      })
      .catch((err) => {
        console.error(err);
        setLoaderShow(false);
      });
  };

  const methodCallApiCall = async () => {
    setLoaderShow(true);
    apiBackendInstance
      .get(Urls.getEndpointMethodCallUrl(id), {
        // apiBackendInstance.get(`http://localhost:3001/endpoints/method-breakdown/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data.success) {
          setMethodCallList(response.data.data);
        }
        setLoaderShow(false);
      })
      .catch((err) => {
        console.error(err);
        setLoaderShow(false);
      });
  };

  const fetchRecentMethodlist = async () => {
    setLoaderShow(true);
    apiBackendInstance
      .get(Urls.getEndpointRecentMethodCUrl(id), {
        // apiBackendInstance.get(`http://localhost:3001/endpoints/recent-request/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data.success) {
          setRecentMethodList(response.data.data);
        }
        setLoaderShow(false);
      })
      .catch((err) => {
        console.error(err);
        setLoaderShow(false);
      });
  };

  useEffect(() => {
    callApiSummary();
    methodCallApiCall();
    fetchRecentMethodlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = (val: string) => {
    const divId: HTMLElement | null = document.getElementById(val);
    if (divId) {
      const txt = divId.textContent;
      if (txt) {
        navigator.clipboard.writeText(txt);
        setIsCopiedTxt(true);
        setTimeout(() => {
          setIsCopiedTxt(false);
        }, 1500);
      }
    }
  };

  const calculateTime = (receivedAt: string) => {
    const oldDate = moment(receivedAt);
    const result = oldDate.fromNow();
    return result;
  };

  const parseMethodName = (request: string) => {
    try {
      const parseObj = JSON.parse(request);
      return parseObj.method || "";
    } catch (err) {
      return "";
    }
  };

  return (
    <div>
      <div className="row justify-content-between">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-5">
          <h5>Summary</h5>
          <div className="row">
            <div className="col-6 mt-4">
              <div className="card p-3 h-100">
                <p className="fw-bold">Success % (Last 24 Hrs)</p>
                <h5>
                  {typeof summaryData.successRate === "number"
                    ? summaryData.successRate
                    : "-"}
                </h5>
              </div>
            </div>
            <div className="col-6 mt-4">
              <div className="card p-3 h-100">
                <p className="fw-bold">Total Request (Last 24 Hrs)</p>
                <h5>
                  {typeof summaryData.totalRequest === "number"
                    ? summaryData.totalRequest
                    : "-"}
                </h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 mt-4">
              <div className="card p-3 h-100">
                <p className="fw-bold">Invalid Request (Last 24 Hrs)</p>
                <h5>
                  {typeof summaryData.invalidRequest === "number"
                    ? summaryData.invalidRequest
                    : "-"}
                </h5>
              </div>
            </div>
            <div className="col-6 mt-4">
              <div className="card p-3 h-100">
                <p className="fw-bold">API Units Consumed (Last 5 Mins)</p>
                <h5>
                  {typeof summaryData.apiUnits === "number" ||
                  typeof summaryData.apiUnits === "string"
                    ? summaryData.apiUnits
                    : "-"}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-5 col-lg-6 col-md-12 col-sm-12 mt-5">
          <h5>Method call breakdown</h5>
          <div className="row">
            <div className="card p-3 table-responsive mt-4 table-card ">
              <table className="table mb-0">
                <thead>
                  <tr className="d-flex">
                    <th className="text-start" style={{ flex: 2 }} scope="col">
                      Method
                    </th>
                    <th className="text-center" style={{ flex: 1 }} scope="col">
                      HTTP
                    </th>
                    <th className="text-center" style={{ flex: 1 }} scope="col">
                      WS
                    </th>
                    <th className="text-center" style={{ flex: 1 }} scope="col">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {methodCallList && methodCallList.length > 0 ? (
                    methodCallList.map((item, index) => (
                      <tr className="d-flex" key={`method-${index.toString()}`}>
                        <td className="text-start" style={{ flex: 2 }}>
                          {item.methodName}
                        </td>
                        <td className="text-center" style={{ flex: 1 }}>
                          {item.httpCount}
                        </td>
                        <td className="text-center" style={{ flex: 1 }}>
                          {item.wsCount}
                        </td>
                        <td className="text-center" style={{ flex: 1 }}>
                          {item.httpCount + item.wsCount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <div className="text-center">
                      <p className="mt-4 fs-6 text-muted">No Data</p>
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-5">
          <h5>Recent Request</h5>
          {isCopiedTxt && (
            <div
              className="alert alert-success text-center mt-3 mb-3"
              role="alert"
            >
              Copied
            </div>
          )}

          <div className="row justify-content-between mt-4">
            <div className="card p-3 h-100">
              <div style={{ padding: "1rem 1.25rem", marginRight: "1.25rem" }}>
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th className="col-3">METHOD</th>
                      <th className="col-2">ERROR CODE</th>
                      <th className="col-2">HTTP</th>
                      <th className="col-2">RESPONSE TIME</th>
                      <th className="col-2">SENT</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div
                className="accordion accordion-sec"
                id="accordionExample"
                style={{ maxHeight: "250px", overflowY: "scroll" }}
              >
                {recentMethodList && recentMethodList.length > 0 ? (
                  recentMethodList.map(
                    (item: RecentMethodTypes, index: number) => (
                      <div
                        className="accordion-item"
                        key={`req-${index.toString()}`}
                      >
                        <h2
                          className="accordion-header"
                          id={`heading-${index}`}
                        >
                          <div
                            className="accordion-button collapsed"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded="true"
                            aria-controls={`collapse${index}`}
                          >
                            <table className="w-100">
                              <tbody>
                                <tr className="accordion-heading">
                                  <td className="col-1">{index + 1}</td>
                                  <td className="col-3">
                                    {parseMethodName(item.request)}
                                  </td>
                                  <td className="col-2">{item.errorCode}</td>
                                  <td className="col-2">
                                    {item.responseCode
                                      ? item.responseCode
                                      : "-"}
                                  </td>
                                  <td className="col-2">
                                    {item.responseTime
                                      ? `${item.responseTime} ms`
                                      : "-"}
                                  </td>
                                  <td className="col-2">
                                    {item.receivedAt
                                      ? calculateTime(item.receivedAt)
                                      : "-"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading-${index}`}
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <table className="w-100">
                              <tbody>
                                <tr>
                                  <td
                                    className="col-6 border p-3"
                                    style={{ verticalAlign: "top" }}
                                  >
                                    <p className="d-flex text-align-end justify-content-end">
                                      <i
                                        className="fa-regular fa-copy text-primary fs-6 cursor"
                                        aria-hidden
                                        onClick={() =>
                                          copyText(`request-${index}`)
                                        }
                                      />
                                    </p>
                                    <JSONPretty
                                      id={`request-${index}`}
                                      data={item.request}
                                    />
                                  </td>
                                  <td
                                    className="col-6 border p-3"
                                    style={{ verticalAlign: "top" }}
                                  >
                                    <p className="d-flex text-align-end justify-content-end">
                                      <i
                                        className="fa-regular fa-copy text-primary fs-6 cursor"
                                        aria-hidden
                                        onClick={() =>
                                          copyText(`response-${index}`)
                                        }
                                      />
                                    </p>
                                    <JSONPretty
                                      id={`response-${index}`}
                                      data={item.response}
                                      errorStyle="white-space: pre-wrap"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center">
                    <hr />
                    <p className="mt-4 fs-6 text-muted">No Data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomLoader showLoader={loaderShow} />
    </div>
  );
};

export default Metrics;
