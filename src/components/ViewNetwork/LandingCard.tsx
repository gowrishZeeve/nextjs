/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import TokenManager from "@zeeve-platform/login-utility";
import { Modal } from "@/components/Modal";
import axios from "axios";
import stopicon from "@/assets/Stop.png";
import sync from "@/assets/sync.png";
import chart from "@/assets/Chart.png";
import lock from "@/assets/Lock.png";
import infocircle from "@/assets/info-circle.png";
import deleteicon from "@/assets/Delete.png";
import cloud2 from "@/assets/cloud-2.png";
import cloud3 from "@/assets/AWS.png";
import cloud5 from "@/assets/cloud-5.png";
import cloud4 from "@/assets/cloud-4.png";
import tencent from "@/assets/tencent.svg";
import runningicon from "@/assets/notifications-green.png";
import googlecloud from "@/assets/google-cloud.png";
import pendingIcon from "@/assets/notifications-time.png";
import Urls from "@/utils/baseURLs";
import CloudInfo from "@/utils/cloudInfo";
import CustomLoader from "@/components/CustomLoader";
import apiBackendInstance from "@/utils/axios";
import Image from "next/image";
import { useRouter } from 'next/navigation'

const getCloudImage = (str: string | number) => {
  switch (CloudInfo.getCloudById(str)) {
    case "AWS":
      return cloud3;
    case "DIGITAL-OCEAN":
      return cloud2;
    case "Azure":
      return cloud5;
    case "IBM":
      return cloud4;
    case "GCP":
      return googlecloud;
    case "TENCENT":
      return tencent;

    default:
      return cloud3;
  }
};

interface nodeType {
  cloudimage: string;
  endpoint: string;
  region: string;
  node: string | number;
  state: string;
  nodeName: string;
  networkId: string | number;
  setNodeId: (x: string) => void;
  setRpcList: (x: string[]) => void;
  setCodes: Dispatch<SetStateAction<any>>;
}
interface regionBody {
  id: string | number;
  region_name: string;
}
const LandingCard = ({
  cloudimage,
  region,
  node,
  state,
  endpoint,
  nodeName,
  networkId,
  setNodeId,
  setRpcList,
  setCodes,
}: nodeType) => {
  const [inActiveBtn, setInActiveBtn] = useState(false);
  const [regions, setRegion] = useState([] as regionBody[]);
  const [showDeleteNodeModal, setShowDeleteNodeModal] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [analyticsUrls, setAnalyticsUrls] = useState<
    { dashboardName: string; dashboardURL: string }[]
  >([]);

  const router = useRouter()


  const loadRegions = () => {
    apiBackendInstance
      .get(Urls.getCloudRegion(cloudimage), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data && response.data.data) {
          setRegion(response.data.data);
        }
      })
      .catch(() => {
        setRegion([]);
        console.error("error getting regions");
      });
  };
  const getRegionName = (id: string | number) => {
    for (let i = 0; i < regions.length; i += 1) {
      if (regions[i].id === id.toString()) {
        return regions[i].region_name;
      }
    }
    return "none";
  };

  const getNodeAnalyticsUrls = async () => {
    try {
      const token = TokenManager.getInstance().getAccessToken();
      const analyticsDashboardURLsResponse = await axios.get(
        `/analytics/api/dashboard-urls?nodeID=${node}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        analyticsDashboardURLsResponse &&
        analyticsDashboardURLsResponse.data
      ) {
        setAnalyticsUrls(analyticsDashboardURLsResponse.data);
      }
    } catch (error) {
      setAnalyticsUrls([]);
    }
  };

  useEffect(() => {
    loadRegions();
    if (
      state &&
      (state.toLowerCase() !== "requested" || state.toLowerCase() !== "failed")
    ) {
      getNodeAnalyticsUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setText = (id: number | string, val: string) => {
    getBlockHeight(id.toString());
    setNodeId(id.toString());
    apiBackendInstance
      .get(Urls.getRpcDetail(networkId.toString(), id.toString()), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data && response.data.data) {
          const urlTag = document.getElementById("urlTag");
          const beaconUrlTag = document.getElementById("beaconUrlTag");
          const beaconPtag = document.getElementById("beaconPtag");
          const httpPtag = document.getElementById("httpPtag");
          const webPtag = document.getElementById("webPtag");
          const syncDistanceTag = document.getElementById("syncDistance");
          const isSyncingTag = document.getElementById("isSyncing");
          const rpcName = response.data.data.rpcUsername;
          let httpUrl: URL | undefined;
          let wsUrl: URL | undefined;
          let beaconUrl: URL | undefined;
          setRpcList(response.data.data.apis);
          if (beaconPtag) {
            if (response.data.data.beacon) {
              beaconPtag.innerHTML = ` https://${rpcName}:****@${val}/beacon-rpc`;
            } else {
              beaconPtag.innerHTML = "Not enabled";
            }
          }
          if (httpPtag) {
            if (response.data.data.http) {
              httpPtag.innerHTML = ` https://${rpcName}:****@${val}/execution-rpc`;
            } else {
              httpPtag.innerHTML = "Not enabled";
            }
          }
          if (webPtag) {
            if (response.data.data.ws) {
              webPtag.innerHTML = ` wss://${rpcName}:****@${val}/execution-ws`;
            } else {
              webPtag.innerHTML = "Not enabled";
            }
          }
          // if (urlTag) {
          //   urlTag.innerHTML = `const url = "https://${rpcName}:****@${val}";`;
          // }
          // if (beaconUrlTag) {
          //   beaconUrlTag.innerHTML = `curl -X GET "https://${rpcName}:****@${val}/beacon-rpc/eth/v1/beacon/genesis" -H "accept: application/json"`;
          // }

          if (response.data.data.http) {
            httpUrl = new URL(`https://${rpcName}:****@${val}/execution-rpc`);
          } else {
            httpUrl = undefined;
          }

          if (response.data.data.ws) {
            wsUrl = new URL(`wss://${rpcName}:****@${val}/execution-ws`);
          } else {
            wsUrl = undefined;
          }

          if (response.data.data.beacon) {
            beaconUrl = new URL(
              `https://${rpcName}:****@${val}/beacon-rpc/eth/v1/beacon/genesis`
            );
          } else {
            beaconUrl = undefined;
          }

          if (setCodes) {
            setCodes(() => [
              {
                lang: "CURL",
                http:
                  httpUrl &&
                  `
  curl ${httpUrl.href} -X POST -H 'Content-Type:application/json' -d '{ "jsonrpc" : "2.0", "id" : 1, "method": "eth_blockNumber","params":[] }'`,
                beacon:
                  beaconUrl &&
                  `
  curl -X GET ${beaconUrl.href} -H "accept: application/json"`,
              },
              {
                lang: "WSCAT",
                wss:
                  wsUrl &&
                  `
  npx wscat -c ${wsUrl.href}`,
              },
              {
                lang: "NodeJs",
                http:
                  httpUrl &&
                  `
  import axios from "axios";
  
  const data = JSON.stringify({
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_blockNumber",
  "params": []
  });
  
  const config = {
  method: 'post',
  url: '${httpUrl.href}',
  headers: {
  'Content-Type': 'application/json'
  },
  data : data
  };
  
  axios(config)
  .then(function (response) {
  console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
  console.log(error);
  });`,
                wss:
                  wsUrl &&
                  `
  import WebSocket from 'ws';
  
  const ws = new WebSocket('${wsUrl.href}');
  
  ws.on('open', function open() {
      console.log('connected');
  
  // NOTE : use delay to avoid missing messages from server
      setTimeout(() => {
              const msg = {"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0x7bf7b17da59880d9bcca24915679668db75f9397", "0x0"],"id":1};
      ws.send(JSON.stringify(msg));
  }, 1000);
  });
  ws.on('message', function message(data) {
  console.log('received: %s', data);
  });`,
                beacon:
                  beaconUrl &&
                  `
  import axios from "axios";
                
  const config = {
  method: 'get',
  url: '${beaconUrl.href}',
  headers: {
  'Content-Type': 'application/json'
  }};
                  
  axios(config)
  .then(function (response) {
  console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
  console.log(error);
  });`,
              },
              {
                lang: "Python",
                http:
                  httpUrl &&
                  `
  import requests
                
  url = '${httpUrl.href}'
  payload = {
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_blockNumber",
  "params": []
  }
                          
  x = requests.post(url, json = payload)
                          
  print(x.text)`,
                wss:
                  wsUrl &&
                  `
  import asyncio
  from websockets import connect
  import time
  import json
  
  async def hello(uri):
      async with connect(uri) as websocket:
              print('connected')
              time.sleep(1)
              await websocket.send(json.dumps({"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0x7bf7b17da59880d9bcca24915679668db75f9397", "0x0"],"id":1}))
              message = await websocket.recv()
              print(message)
  
  asyncio.run(hello("${wsUrl.href}"))`,
                beacon:
                  beaconUrl &&
                  `
  import requests
                
  url = '${beaconUrl.href}'
  payload = {
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_blockNumber",
  "params": []
  }
                                        
  x = requests.post(url, json = payload)
                                        
  print(x.text)`,
              },
              {
                lang: "Go",
                http:
                  httpUrl &&
                  `
  package main
  
  import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "log"
  "net/http"
  "strings"
  )
  
  func main() {
  data, err := json.Marshal(map[string]interface{}{
     "jsonrpc": "2.0",
     "method":  "eth_blockNumber",
     "id":      1,
     "params":  []interface{}{},
  })
  if err != nil {
     log.Fatalf("Marshal error: %v", err)
  }
  
  resp, err := http.Post("${httpUrl.href}",
     "application/json",
     strings.NewReader(string(data)),
  )
  if err != nil {
     log.Fatalf("HTTP request error: %v", err)
  }
  defer resp.Body.Close()
  
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
     log.Fatalf("ReadAll error: %v", err)
  }
  
  fmt.Println(string(body))
  }`,
                wss:
                  wsUrl &&
                  `
  package main
  
  import (
      "encoding/base64"
      "log"
      "net/http"
      "os"
      "os/signal"
      "time"
  
      "github.com/gorilla/websocket"
  )
                                  
  func main() {
      addr := "wss://${val}/ws"
      username := "${response.data.rpcUsername}"
      password := "****"
      headers := http.Header{
          "Authorization": {"Basic " + base64.StdEncoding.EncodeToString([]byte(username+":"+password))},
      }
      interrupt := make(chan os.Signal, 1)
      signal.Notify(interrupt, os.Interrupt)
      log.Printf("connecting to: %s with headers: %v", addr, headers)
      c, _, err := websocket.DefaultDialer.Dial(addr, headers)
      if err != nil {
          log.Fatal("dial error: ", err)
      }
      defer c.Close()
      done := make(chan struct{})
      go func() {
          defer close(done)
          for j := 1; j <= 1; j++ {
              _, message, err := c.ReadMessage()
              if err != nil {
                  log.Println("read error:", err)
                  return
              }
              log.Printf("received: %s", message)
          }
      }()
      ticker := time.NewTicker(time.Second)
      defer ticker.Stop()
      for {
          select {
          case <-done:
              log.Println("done")
              return
          case <-ticker.C:
              data := \`{ "jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": [] }\`
              err = c.WriteMessage(websocket.TextMessage, []byte(data))
              if err != nil {
                  log.Println("write error:", err)
                  return
              }
              log.Printf("sent: %s", data)
          case <-interrupt:
              log.Println("interrupt")
              err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
              if err != nil {
                  log.Println("write close:", err)
                  return
              }
              select {
              case <-done:
              case <-time.After(time.Second):
              }
              return
          }
      }
  }
                
                `,
                beacon:
                  beaconUrl &&
                  `
  package main
  
  import (
      "fmt"
      "io/ioutil"
      "log"
      "net/http"
  )
  
  func main() {
      resp, err := http.Get("${beaconUrl.href}")
      if err != nil {
          log.Fatalf("HTTP request error: %v", err)
      }
  
  defer resp.Body.Close()
  
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
      log.Fatalf("ReadAll error: %v", err)
  }
  
  fmt.Println(string(body))
  }`,
              },
            ]);
          }
          if (response.data.data.beacon) {
            getBeaconNodeSyncingStatus(id.toString());
          } else {
            if (syncDistanceTag) {
              syncDistanceTag.innerHTML = "-";
            }
            if (isSyncingTag) {
              isSyncingTag.innerHTML = "-";
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setRpcList([]);
      });
  };
  const getBlockHeight = (nodeId: string) => {
    const blockHeightTag = document.getElementById("blockHeight");

    apiBackendInstance
      .get(Urls.getNodeInfo(networkId.toString(), nodeId), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data && response.data.data) {
          if (blockHeightTag) {
            blockHeightTag.innerHTML = response.data.data.blockHeight;
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getBeaconNodeSyncingStatus = (nodeId: string) => {
    const syncDistanceTag = document.getElementById("syncDistance");
    const isSyncingTag = document.getElementById("isSyncing");

    apiBackendInstance
      .get(Urls.getBeaconNodeSyncingStatusAPI(networkId.toString(), nodeId), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data.data && response.data.data.data) {
          if (syncDistanceTag) {
            syncDistanceTag.innerHTML = response.data.data.data.sync_distance;
          }
          if (isSyncingTag) {
            isSyncingTag.innerHTML = response.data.data.data.is_syncing
              ? "Syncing"
              : "Not syncing";
          }
        } else {
          if (syncDistanceTag) {
            syncDistanceTag.innerHTML = "-";
          }
          if (isSyncingTag) {
            isSyncingTag.innerHTML = "-";
          }
        }
      })
      .catch((err) => {
        console.error(err);
        if (syncDistanceTag) {
          syncDistanceTag.innerHTML = "-";
        }
        if (isSyncingTag) {
          isSyncingTag.innerHTML = "-";
        }
      });
  };
  const confirmDeleteNode = () => {
    setShowLoader(true);
    setInActiveBtn(true);
    setShowConfirmBtn(false);

    apiBackendInstance
      .delete(Urls.deleteNodeUrl(networkId.toString(), node.toString()), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setShowDeleteMsg(true);
          setDeleteMsg(response.data.data.data);
          if (response.data.data.success) {
            setTimeout(() => {
              // window.location.reload();
              router.refresh()
            }, 10000);
          }
        }
        setShowLoader(false);
        setInActiveBtn(false);
      })
      .catch((err) => {
        console.error(err);
        setDeleteMsg("error deleting node");
        setShowDeleteMsg(true);
        setShowLoader(false);
        setInActiveBtn(false);
      });
  };

  const deleteNode = () => {
    setShowConfirmBtn(true);
    setShowDeleteNodeModal(true);
  };
  const showMessage = (id: string) => {
    const div2 = document.getElementById(id);
    if (div2) div2.style.display = "block";
    setTimeout(() => {
      if (div2) div2.style.display = "none";
    }, 1000);
  };
  const hideModal = () => {
    setShowDeleteNodeModal(false);
    setDeleteMsg("");
  };
  return (
    <div>
      <CustomLoader showLoader={showLoader} />

      <div
        className="mt-4 d-flex text-center "
        style={{ textAlign: "center", justifyContent: "center" }}
      >
        <div className="col-2 p-1 mt-1 border-end">
          <Image
            src={getCloudImage(cloudimage)}
            style={{ height: "30px", width: "30px" }}
            alt=""
          />
          <p className="mt-1 mb-0" title={node.toString()}>
            {nodeName}
          </p>
        </div>
        <div className="col-4 p-2 border-end">
          <p className="mb-0">{getRegionName(region)}</p>
          <a
            href="#display"
            className="btn mt-1"
            onClick={() => {
              setText(node, endpoint);
            }}
            style={{
              border: "#4D88F7 solid 2px",
              color: "#3E7EF5",
              fontSize: "12px",
            }}
          >
            View Endpoint
          </a>
        </div>
        {state !== "payment_pending" && (
          <div className="mt-3 p-1 col-3 border-end">
            {state !== "ready" && (
              <li className="btnNodeli">
                <Image
                  className="btnNode"
                  title="locked"
                  src={lock}
                  style={{ height: "22px" }}
                  alt=""
                />
              </li>
            )}
            {state === "ready" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <li
                  className="btnNodeli mx-1"
                  title="stop"
                  onClick={() => {
                    showMessage("fail");
                  }}
                >
                  <Image
                    className="btnNode"
                    src={stopicon}
                    style={{ height: "22px" }}
                    alt=""
                  />
                </li>
                <li
                  className="btnNodeli"
                  title="restart"
                  onClick={() => {
                    showMessage("fail");
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
            )}
          </div>
        )}
        {state !== "payment_pending" && (
          <div className="mt-3 p-1 col-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <li className="btnNodeli">
                <div className="btn-group btnNodeli">
                  <Image
                    className="btnNode dropdown-toggle"
                    src={chart}
                    style={{ height: "22px" }}
                    alt=""
                    id={`${node}dropdownMenuButton2`}
                    data-toggle="dropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton2"
                  >
                    {analyticsUrls && analyticsUrls.length > 0 ? (
                      analyticsUrls.map((item) => (
                        <a
                          className="dropdown-item"
                          href={item.dashboardURL}
                          key={item.dashboardName}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.dashboardName}
                        </a>
                      ))
                    ) : (
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          showMessage("analyticsDiv");
                        }}
                      >
                        Analytics Not Ready
                      </button>
                    )}
                  </div>
                </div>
              </li>
              {state !== "requested" && (
                <li
                  className="btnNodeli"
                  ata-toggle="tooltip"
                  data-placement="top"
                  title="Delete Node"
                  onClick={() => {
                    deleteNode();
                  }}
                >
                  <Image
                    className="btnNode mx-1"
                    src={deleteicon}
                    style={{ height: "22px" }}
                    alt=""
                  />
                </li>
              )}
              {state === "ready" && (
                <Image
                  src={runningicon}
                  style={{ height: "22px" }}
                  title="Running"
                  alt=""
                />
              )}
              {state === "provisioning" && (
                <Image
                  src={pendingIcon}
                  style={{ height: "22px" }}
                  title="Pending"
                  alt=""
                />
              )}
              {state !== "ready" && state !== "provisioning" && (
                <Image
                  src={infocircle}
                  style={{ height: "22px" }}
                  title="Stopped"
                  alt=""
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        confirmBtnText="Delete"
        onHide={() => hideModal()}
        onConfirm={() => {
          confirmDeleteNode();
        }}
        show={showDeleteNodeModal}
        visibleFooter
        title="Are you sure you want to delete Node?"
        visibleConfirmBtn={showConfirmBtn}
        visibleFooterCloseButton
        visibleHeaderCloseIcon={false}
        disableConfirmBtn={inActiveBtn}
      >
        {showDeleteMsg && <p className="mt-3 p-1 text-center">{deleteMsg}</p>}
      </Modal>
    </div>
  );
};

export default LandingCard;
