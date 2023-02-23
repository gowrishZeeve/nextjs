"use client"
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-quotes */
/* eslint-disable no-console */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable func-names */

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import { Modal } from "@/components/Modal";
import ServerCard from "@/components/ViewNetwork/ServerCard";
import Urls from "@/utils/baseURLs";
import sync from "@/assets/sync.png";
import NodeCard from "@/components/ViewNetwork/NodeCard";
import { prefixPath } from "@/utils/helpers";
import RpcComponent from "@/components/ViewNetwork/RPCComponent";
import CustomLoader from "@/components/CustomLoader";
import apiBackendInstance from "@/utils/axios";
import Image from "next/image";
import { useRouter,redirect } from 'next/navigation'

type CodeSnippetType = "CURL" | "WSCAT" | "NodeJs" | "Python" | "Go" | "none";

export interface network {
  id: number | string;
  name: string;
  domain_id: number | string;
  node_name: string;
  owned_by: string;
  updated_at: string;
  created_at: string;
  node_id: number | string;
  network_id: number | string;
  cloud_id: string | number;
  region_id: string | number;
  endpoint: string;
  status: string;
  redirection_url: string;
}
export interface rpcDetailType {
  rpcUsername: string;
  networkId: string;
  apis: string[];
  paymentStatus: string;
}

interface BeaconNodeSyncStatus {
  head_slot: string;
  sync_distance: string;
  is_syncing: boolean;
  is_optimistic: boolean;
}

const ViewNetworkBody = ({ id }: { id: string | number }) => {
  const [networkData, setNetworkData] = useState<network[] | []>([]);
  const [page, setPage] = useState("node");
  const [name, setName] = useState("My Network");
  const [networkType, setNetworkType] = useState("");
  const [inActive, setInActive] = useState(false);
  const [nodeId, setNodeId] = useState("");
  const [mangedHosting, setManagedHosting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState("");
  const [rpcList, setRpcList] = useState([] as string[]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);
  const [beaconNodeSyncingStatus, setBeaconNodeSyncingStatus] =
    useState<BeaconNodeSyncStatus>();
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippetType>("CURL");
  const [codeType, setCodeType] = useState<"https" | "wss" | "beacon">("https");
  const [codes, setCodes] = useState<
    { lang: CodeSnippetType; http?: string; wss?: string; beacon?: string }[]
  >([]);

  const router = useRouter()

  function myFunction() {
    document.getElementById("myDropdown")?.classList.toggle("show");
  }

  window.onclick = function (event) {
    const drop = document.getElementById("actionBtn");
    if (event.target !== drop) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i += 1) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
  const getNetworkDetail = () => {
    apiBackendInstance
      .get(Urls.getNetworkDetail(id), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data) {
          setName(response.data.data.name);
          setNetworkType(response.data.data.network);
          setManagedHosting(
            response.data.data.inputConfigurations.managedHosting
          );
          setNetworkStatus(response.data.data.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setShowLoader(true);
    getNetworkDetail();
    apiBackendInstance
      .get(Urls.getAllNodesUrl(id), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data) {
          setNetworkData(response.data.data);
        }
        setShowLoader(false);
      })
      .catch(() => {
        setNetworkData([]);
        setShowLoader(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const deleteNetwork = (networkId: number | string): void => {
    setShowConfirmBtn(false);
    setInActive(true);
    setShowLoader(true);
    apiBackendInstance
      .delete(Urls.deleteNetworkById(networkId), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data) {
          setShowDeleteMsg(true);
          if (response.data.success) {
            setDeleteMsg(
              response.data?.data.message ||
                "Network Deleted redirecting to dashboard"
            );
          } else {
            setDeleteMsg(
              response.data?.data.message || "Error deleting network"
            );
          }
          setShowLoader(false);
          setTimeout(() => {
            // window.open(Urls.getAllNetworkUrl(), "_self");
            redirect(Urls.getAllNetworkUrl())
          }, 3000);
        }
        setInActive(false);
      })
      .catch((err) => {
        setShowDeleteMsg(true);

        let deleteMessage = "";

        if (err.response) {
          if (err.response.data.message) {
            deleteMessage = err.response.data.message;
          } else {
            deleteMessage = err.response.data;
          }
        }
        // eslint-disable-next-line no-nested-ternary
        setDeleteMsg(
          deleteMessage.length > 0 ? deleteMessage : "Error deleting network"
        );
        console.error(err);
        setInActive(false);
        setShowLoader(false);
      });
  };
  const getBlockHeight = () => {
    if (nodeId) {
      setShowLoader(true);
      apiBackendInstance
        .get(Urls.getNodeInfo(id.toString(), nodeId), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response && response.data) {
            setBlockHeight(response.data.data.blockHeight);
          }
          setShowLoader(false);
        })
        .catch((err) => {
          setShowLoader(false);
          console.error(err);
        });
    }
    setShowLoader(false);
  };
  const getBeaconNodeSyncingStatus = () => {
    if (nodeId) {
      apiBackendInstance
        .get(Urls.getBeaconNodeSyncingStatusAPI(id.toString(), nodeId), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response && response.data) {
            if (response.data.success) {
              setBeaconNodeSyncingStatus(response.data.data.data);
            } else {
              setBeaconNodeSyncingStatus(undefined);
            }
          }
        })
        .catch((err) => {
          setBeaconNodeSyncingStatus(undefined);
          console.error(err);
        });
    }
  };
  const setSelected = (num: number) => {
    for (let i = 1; i < 4; i += 1) {
      const spanSelected: HTMLBaseElement | null = document.querySelector(
        `#span${i}`
      );
      const liSelected: HTMLBaseElement | null = document.querySelector(
        `#Li${i}`
      );
      if (i !== num) {
        if (
          spanSelected &&
          liSelected &&
          spanSelected.classList.contains("active-node")
        ) {
          spanSelected.classList.remove("active-node");
          liSelected.classList.remove("active-item");
        }
      } else if (
        i === num &&
        spanSelected &&
        !spanSelected.classList.contains("active-node")
      ) {
        spanSelected.classList.add("active-node");
        liSelected?.classList.add("active-item");
      }
    }
  };
  const setView = () => {
    switch (page) {
      case "node":
        return (
          <NodeCard
            setRpcList={setRpcList}
            setNodeId={setNodeId}
            networkData={networkData}
            setCodes={setCodes}
          />
        );
      default:
        return (
          <NodeCard
            setRpcList={setRpcList}
            setNodeId={setNodeId}
            networkData={networkData}
            setCodes={setCodes}
          />
        );
    }
  };
  const copyText = (val: string) => {
    const ptag: HTMLElement | null = document.getElementById("succ");
    const ptag2: HTMLElement | null = document.getElementById(val);

    if (ptag2) {
      const txt = ptag2.textContent;
      if (txt) {
        navigator.clipboard.writeText(txt);
        if (ptag) {
          ptag.style.display = "block";
          setTimeout(() => {
            ptag.style.display = "none";
          }, 1500);
        }
      }
    }
  };
  const checkNetworkStatus = (): boolean => {
    if (networkStatus === "ready" || networkStatus === "provisioning") {
      return true;
    }
    return false;
  };
  return (
    <section className="px-5 col-xl-10 col-lg-10 col-md-9 col-sm-8 workspace w-100 h-100">
      <div>
        <div className="row mt-4 align-items-center">
          <div className="col-lg-6 mt-2 col-xl-6 col-sm-12 col-xs-12 cursor">
            <Breadcrumb
              prefixLink={[
                { name: "Home", path: Urls.getDashboardUrl() },
                { name: "Network", path: Urls.getAllNetworkUrl() },
              ]}
              className="mt-1"
              textSize={15}
              activeLink={name || "loading"}
            >
              <span className="p-1 mx-2 all-color" style={{ fontSize: "13px" }}>
                {mangedHosting ? " - Zeeve Managed" : " - BYOC"}
              </span>
            </Breadcrumb>
          </div>
          <div className="col-lg-6 col-xl-6 col-sm-12 col-xs-12 cursor button-add">
            <div className="d-flex justify-content-end mx-5" style={{}}>
              <div className="dropdown">
                <button
                  type="button"
                  onClick={() => {
                    myFunction();
                  }}
                  id="actionBtn"
                  disabled={!checkNetworkStatus()}
                  className="ms-2 btn btn-primary"
                  style={{ borderRadius: "10px" }}
                >
                  Actions
                </button>
                <div id="myDropdown" className="dropdown-content">
                  <li
                    onClick={() => {
                      // window.open(prefixPath(`/addnode/${id}`), "_self");
                      redirect(prefixPath(`/addnode/${id}`))
                    }}
                  >
                    Add Node
                  </li>
                  <li
                    onClick={() => {
                      setShowConfirmBtn(true);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete Network
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-between ">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-5">
            <div className="card node-process h-100">
              <nav className="navbar navbar-expand-lg navbar-light border-bottom">
                <div className="container-fluid">
                  <div className="" id="navbarNav">
                    <ul className="Navbar nav container-equal-space">
                      <li
                        id="Li1"
                        className="nav-item active-item "
                        onClick={() => {
                          setPage("node");
                          setSelected(1);
                        }}
                      >
                        <span id="span1" className="nav-link active-node ">
                          Nodes
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <div>{setView()}</div>
            </div>
          </div>
          <ServerCard data={networkData} />
        </div>
        <CustomLoader showLoader={showLoader} />
      </div>
      <div
        id="succ"
        className="alert alert-success mt-3 mb-5"
        style={{ display: "none" }}
        role="alert"
      >
        Copied
      </div>
      <div className="row ">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mx-auto mt-5">
          <div className="card infoCard h-100">
            <div
              className="m-4 border p-4"
              style={{ backgroundColor: "#F7F7F7", borderRadius: "10px" }}
            >
              <h6 className="mt-3 text-center">Node Info</h6>
              <div
                className="row mb-2 mt-3 text-center col-12 ms-1"
                style={{ border: "2px solid #D7DBE3", borderRadius: "5px" }}
              >
                <div className="col-4 pt-3  border-end">BlockHeight</div>
                <div className="col-4 pt-3 border-end">
                  <p id="blockHeight">{blockHeight || "-"}</p>
                </div>
                <div className="col-4 mt-3 text-center">
                  <li
                    className="btnNodeli col-3 mx-5"
                    style={{ border: "1px solid #D7DBE3" }}
                    title={nodeId ? "refresh" : "please select node first"}
                    onClick={() => {
                      getBlockHeight();
                    }}
                  >
                    <Image
                      className="btnNode"
                      src={sync}
                      style={{ height: "22px" }}
                      alt=""
                    />
                  </li>
                </div>
              </div>
              {/* beacon node syncing status  */}
              {networkType && networkType.toLowerCase() !== "rinkeby" && (
                <div
                  className="row mb-2 mt-3 text-center col-12 ms-1"
                  style={{ border: "2px solid #D7DBE3", borderRadius: "5px" }}
                >
                  <div className="col-3 pt-3  border-end">Syncing Distance</div>
                  <div className="col-3 pt-3 border-end">
                    <p id="syncDistance">
                      {(beaconNodeSyncingStatus &&
                        beaconNodeSyncingStatus.sync_distance) ||
                        "-"}
                    </p>
                  </div>
                  <div className="col-3 pt-3 border-end">
                    <p id="isSyncing">
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {beaconNodeSyncingStatus
                        ? beaconNodeSyncingStatus.is_syncing
                          ? "Syncing"
                          : "Not syncing"
                        : "-"}
                    </p>
                  </div>
                  <div className="col-3 mt-3 text-center">
                    <li
                      className="btnNodeli col-3 mx-5"
                      style={{ border: "1px solid #D7DBE3" }}
                      title={nodeId ? "refresh" : "please select node first"}
                      onClick={() => {
                        getBeaconNodeSyncingStatus();
                      }}
                    >
                      <Image
                        className="btnNode"
                        src={sync}
                        style={{ height: "22px" }}
                        alt=""
                      />
                    </li>
                  </div>
                </div>
              )}
              <h6 className="mt-4 text-center">Endpoints</h6>
              <p className="mt-3 text-muted">Execution RPC</p>
              <div className="mt-1 mb-3 d-flex justify-content-between align-items-center px-3 py-2 rounded-2 mt-3 border bg-white cursor">
                <p
                  id="httpPtag"
                  className=" mb-0 text-muted"
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  Please Select your node.
                </p>
                <i
                  className="fa fa-copy fs-6 text-primary cursor"
                  onClick={() => {
                    copyText("httpPtag");
                  }}
                />
              </div>
              <p className="mt-3 text-muted">Execution Web Socket</p>

              <div className="mt-1 mb-3 d-flex justify-content-between align-items-center px-3 py-2 rounded-2 mt-3 border bg-white cursor">
                <p
                  id="webPtag"
                  className="mb-0 text-muted"
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  Please Select your node.
                </p>
                <i
                  className="fa fa-copy fs-6 text-primary cursor"
                  onClick={() => {
                    copyText("webPtag");
                  }}
                />
              </div>
              {networkType && networkType.toLowerCase() !== "rinkeby" && (
                <>
                  <p className="mt-3 text-muted">Beacon RPC</p>
                  <div className="mt-1 mb-3 d-flex justify-content-between align-items-center px-3 py-2 rounded-2 mt-3 border bg-white cursor">
                    <p
                      id="beaconPtag"
                      className=" mb-0 text-muted"
                      style={{
                        wordBreak: "break-all",
                      }}
                    >
                      Please Select your node.
                    </p>
                    <i
                      className="fa fa-copy fs-6 text-primary cursor"
                      onClick={() => {
                        copyText("beaconPtag");
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          id="display"
          className="col-xl-6 col-md-12 col-sm-12 col-lg-6 mx-auto mt-5"
        >
          <div className="card h-100 infoCard">
            <div
              className="m-4 p-4 infoCard"
              style={{ backgroundColor: "#F7F7F7", borderRadius: "10px" }}
            >
              <h6 className="mt-3 text-center">Example Connection Snippet</h6>
              {/* <p className="mt-3 d-flex justify-content-between">
                <div className='text-muted'>For Execution Client</div>
                <div className='text-primary'>JS</div>
              </p>
              <div className="mt-3 card rounded-3 p-2">
                <p
                  className="text-muted my-0 mx-2"
                  id="urlTag"
                >
                  const url = select your node;
                </p>
                <p
                  className="text-muted mx-2 mb-0"
                // style={{ paddingLeft: '2%', textAlign: 'left' }}
                >
                  {' // Using web3js '}
                  <br />
                  const web3 = new Web3(url);
                  <br />
                  {' // Using ethers.js '}
                  <br />
                  const provider = new ethers.providers.JsonRpcProvider(url);
                </p>
              </div>
              {
                networkType && networkType.toLowerCase() !== 'rinkeby'
                && (
                  <>
                    <p className="mt-3 d-flex justify-content-between">
                      <div className='text-muted'>For Beacon Client</div>
                      <div className='text-primary'>CURL</div>
                    </p>
                    <div className="mt-3 card rounded-3 p-2">
                      <i
                        className="fa fa-copy fs-6 text-primary text-end mx-1"
                        onClick={() => {
                          copyText('beaconUrlTag');
                        }}
                      />
                      <p
                        className="text-muted my-0 mx-2"
                        id="beaconUrlTag"
                      >
                        {' curl -X GET "https://select-your-node/eth/v1/beacon/genesis" -H "accept: application/json" '}
                      </p>

                    </div>
                  </>
                )
              } */}
              <p className="text-end mt-2 mb-2">
                <select
                  className="form-select"
                  defaultValue="Curl"
                  onChange={(event) => {
                    const selected = event.currentTarget
                      .value as CodeSnippetType;
                    if (selected === "WSCAT") setCodeType("wss");
                    else setCodeType("https");
                    setCodeSnippet(selected);
                  }}
                >
                  {codes.length === 0 && (
                    <option selected>Please select your node</option>
                  )}
                  {codes.map((code, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={index} value={code.lang}>
                      {code.lang}
                    </option>
                  ))}
                </select>
              </p>
              <div className="card p-2 endpointcard rounded-2 bg-light">
                <ul className="nav nav-tabs " id="myTab" role="tablist">
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{
                      display: codeSnippet === "WSCAT" ? "none" : "block",
                    }}
                    onClick={() => setCodeType("https")}
                  >
                    <button
                      className={`nav-link px-4 ${
                        codeType === "https" ? "active" : ""
                      }`}
                      data-bs-toggle="tab"
                      type="button"
                      role="tab"
                    >
                      <span className="p-1">HTTP</span>
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{
                      display: codeSnippet === "CURL" ? "none" : "block",
                    }}
                    onClick={() => setCodeType("wss")}
                  >
                    <button
                      className={`nav-link px-4 ${
                        codeType === "wss" ? "active" : ""
                      }`}
                      data-bs-toggle="tab"
                      type="button"
                      role="tab"
                    >
                      <span className="p-1">WS</span>
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{
                      display: codeSnippet === "WSCAT" ? "none" : "block",
                    }}
                    onClick={() => setCodeType("beacon")}
                  >
                    <button
                      className={`nav-link px-4 ${
                        codeType === "beacon" ? "active" : ""
                      }`}
                      data-bs-toggle="tab"
                      type="button"
                      role="tab"
                    >
                      <span className="p-1">Beacon</span>
                    </button>
                  </li>
                </ul>
                <div className="d-flex justify-content-between gap-2">
                  <pre>
                    <code id="codesnippet" className="">
                      {codes.length === 0 && <>Please select your node</>}
                      {codes.length > 0 &&
                        codeType === "https" &&
                        (codes.find((code) => codeSnippet === code.lang)
                          ?.http || <>HTTP endpoint is not available!</>)}

                      {codes.length > 0 &&
                        codeType === "wss" &&
                        (codes.find((code) => codeSnippet === code.lang)
                          ?.wss || <>WebSocket endpoint is not available!</>)}

                      {codes.length > 0 &&
                        codeType === "beacon" &&
                        (codes.find((code) => codeSnippet === code.lang)
                          ?.beacon || <>Beacon endpoint is not avaliable!</>)}
                    </code>
                  </pre>
                  <span>
                    <i
                      aria-hidden
                      className="fa fa-copy fs-6 text-primary p-2 cursor"
                      onClick={() => {
                        copyText("codesnippet");
                      }}
                    />
                  </span>
                </div>
              </div>
              <RpcComponent rpcList={rpcList} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        confirmBtnText="Delete"
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteNetwork(id);
        }}
        show={showDeleteModal}
        disableConfirmBtn={inActive}
        visibleFooter
        title={`Are you sure you want to delete ${name} ?`}
        visibleConfirmBtn={showConfirmBtn}
        visibleFooterCloseButton
        visibleHeaderCloseIcon={false}
      >
        {showDeleteMsg && <p className="mt-3 p-1 text-center">{deleteMsg}</p>}
      </Modal>
    </section>
  );
};

export default ViewNetworkBody;
