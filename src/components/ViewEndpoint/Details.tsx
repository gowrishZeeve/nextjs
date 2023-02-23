import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/Modal";
import CustomLoader from "@/components/CustomLoader";
import Urls from "@/utils/baseURLs";
import { highlight, removeHighlight } from "@/utils/helpers";
import apiBackendInstance from "@/utils/axios";
import ErrorMessages from "@/utils/errorMessage";
import { useRouter} from 'next/navigation'

type codeSnippetType = "CURL" | "WSCAT" | "NodeJs" | "Python" | "Go" | "none";

type EndointDetailsTypes = {
  id: string;
  serviceId: string;
  endpointName: string;
  userId: string;
  workspaceId: string;
  apiKey: string;
  networkType: string;
  securityEnabled?: boolean;
  jwtEnabled?: boolean;
  jwtPublicName?: string;
  jwtPublicKey?: string;
  plan: string;
  addOns: string[];
};

interface props {
  id: string;
  setEndpointName: (x: string) => void;
}
interface ConsumptionType {
  consumptionApiUnits: number;
  quotaApiUnits: number;
}
const EndpointDetails = ({ id, setEndpointName }: props) => {
  const [endpointData, setEndpointData] = useState({} as EndointDetailsTypes);
  const [tempEndpointData, setTempEndpointData] = useState(
    {} as EndointDetailsTypes
  );
  const [isDisabled, setIsDisabled] = useState<{
    epName: boolean;
    epSecurity: boolean;
  }>({ epName: true, epSecurity: true });
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [loaderShow, setLoaderShow] = useState<boolean>(false);
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [securityErr, setSecurityErr] = useState<string>("");
  const [endpointId, setEndpointId] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [btnText, setBtnText] = useState<string>("");
  const [isCopiedTxt, setIsCopiedTxt] = useState<boolean>(false);
  const [defaultName, setDefaultName] = useState<string>("My Endpoint");
  const [showConfirmBtn, setShowConfirmBtn] = useState(true);
  const [consumptionDetails, setConsumptionDetails] = useState(
    {} as ConsumptionType
  );
  const [endpointURLs, setEndpointURLs] = useState<{
    http: string;
    wss: string;
  }>({
    http: `${Urls.getEndpointHttpUrl()}/${endpointData.apiKey}/`,
    wss: `${Urls.getEndpointWssUrl()}/${endpointData.apiKey}/`,
  });
  const [codeSnippet, setCodeSnippet] = useState<codeSnippetType>("CURL");
  const [codeType, setCodeType] = useState<"https" | "wss">("https");
  const [codes, setCodes] = useState<
    { lang: codeSnippetType; http?: string; wss?: string }[]
  >([]);

  const router = useRouter()

  const httpRef = useRef<HTMLDivElement>(null);
  const wssRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const jwtRef = useRef<HTMLInputElement>(null);
  const jwtNameRef = useRef<HTMLInputElement>(null);
  const jwtKeyRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const saveName = () => {
    if (validateName()) {
      setLoaderShow(true);
      setModalTitle("Status");
      setShowConfirmBtn(true);
      setBtnText("Ok");
      setIsDisabled((prev) => ({ ...prev, epName: true }));
      const payload = {
        id,
        name: endpointData.endpointName,
      };
      apiBackendInstance
        .put(
          Urls.getUpdateEndpointNameOrSecurityUrl("name"),
          { ...payload },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response?.data?.data?.message) {
            setDefaultName(endpointData.endpointName);
            setMessage(response.data.data.message);
            setTempEndpointData(endpointData);
          }
          setLoaderShow(false);
          setModalShow(true);
          setShowConfirmBtn(false);
        })
        .catch((err) => {
          console.error(err);
          setLoaderShow(false);
          const errMsg =
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
              ? err.response.data.message
              : "Request Failed";
          setMessage(`Error: ${errMsg}`);
          setModalShow(true);
          setShowConfirmBtn(false);
        });
    }
  };

  const cancelEndpointNameChange = () => {
    setEndpointData((prev) => ({
      ...prev,
      endpointName: tempEndpointData.endpointName,
    }));

    setValidationMsg("");
    removeHighlight(nameRef, "border");

    setIsDisabled((prev) => ({ ...prev, epName: true }));
  };

  const cancelSecurityChange = () => {
    setEndpointData((prev) => ({
      ...prev,
      securityEnabled: tempEndpointData.securityEnabled,
      jwtEnabled: tempEndpointData.jwtEnabled,
      jwtPublicKey: tempEndpointData.jwtPublicKey,
      jwtPublicName: tempEndpointData.jwtPublicName,
    }));

    setSecurityErr("");
    removeHighlight(jwtNameRef, "border");
    removeHighlight(jwtKeyRef, "border");
    removeHighlight(jwtRef, "border");

    setIsDisabled((prev) => ({ ...prev, epSecurity: true }));
  };

  useEffect(() => {
    setCodes(() => {
      // const url = new URL(
      //   'https://app.develop.zeeve.io/shared-api/okc/e113ca0e2f0ef05d037fb9f6c54222ffbb1dc58238ee42e3/',
      // );
      // const url = new URL(`${Urls.getEndpointHttpUrl()}/${endpointData.apiKey}/`);

      let httpURL = new URL("https://app.zeeve.io");
      let wsURL = new URL("wss://app.zeeve.io");
      try {
        httpURL = new URL(`${endpointURLs.http}`);
        wsURL = new URL(`${endpointURLs.wss}`);
      } catch (e) {
        httpURL = new URL("https://app.zeeve.io/shared-api/eth/unknown-url");
        wsURL = new URL("wss://app.zeeve.io/shared-api/eth/unknown-url");
      }

      return [
        {
          lang: "CURL",
          http: `
curl ${httpURL.href} -X POST -H 'Content-Type:application/json' -d '{ "jsonrpc" : "2.0", "id" : 1, "method": "eth_blockNumber","params":[] }'`,
        },
        {
          lang: "WSCAT",
          wss: `
npx wscat -c ${wsURL.href}`,
        },
        {
          lang: "NodeJs",
          http: `
import axios from "axios";

const data = JSON.stringify({
"jsonrpc": "2.0",
"id": 1,
"method": "eth_blockNumber",
"params": []
});

const config = {
method: 'post',
url: '${httpURL.href}',
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
          wss: `
import WebSocket from 'ws';

const ws = new WebSocket('${wsURL.href}');

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
        },
        {
          lang: "Python",
          http: `
import requests

url = '${httpURL.href}'
payload = {
"jsonrpc": "2.0",
"id": 1,
"method": "eth_blockNumber",
"params": []
}
          
x = requests.post(url, json = payload)
          
print(x.text)`,
          wss: `
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

asyncio.run(hello("${wsURL.href}"))`,
        },
        {
          lang: "Go",
          http: `
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

resp, err := http.Post("${httpURL.href}",
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
          wss: `
package main

import (
"log"
"os"
"os/signal"
"time"

"github.com/gorilla/websocket"
)

func main() {
addr := "${wsURL.href}"
interrupt := make(chan os.Signal, 1)
signal.Notify(interrupt, os.Interrupt)

log.Printf("connecting to %s", addr)
c, _, err := websocket.DefaultDialer.Dial(addr, nil)
if err != nil {
log.Fatal("dial error:", err)
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
}`,
        },
      ];
    });
  }, [endpointURLs]);

  const validateName = () => {
    if (defaultName === endpointData.endpointName) {
      setValidationMsg("");
      return false;
    }
    if (
      !endpointData.endpointName.match(
        /^[A-Za-z]([A-Za-z0-9\s-]){3,48}[A-Za-z0-9]$/
      )
    ) {
      return false;
    }
    if (
      !("endpointName" in endpointData) ||
      endpointData.endpointName.length < 5 ||
      endpointData.endpointName.length > 50
    ) {
      setValidationMsg("Invalid endpoint name.");
      return false;
    }
    setValidationMsg("");
    return true;
  };

  const validateSecurityDetails = (): boolean => {
    if (
      "securityEnabled" in endpointData &&
      endpointData.securityEnabled === true
    ) {
      if (
        !("jwtEnabled" in endpointData) ||
        endpointData.jwtEnabled === false
      ) {
        highlight(jwtRef, "border");
        setSecurityErr("Please select require jwt field.");
        return false;
      }
      if (
        !("jwtPublicName" in endpointData) ||
        endpointData.jwtPublicName === ""
      ) {
        setSecurityErr("JWT public key name should not be null");
        highlight(jwtNameRef, "border");
        return false;
      }
      if (
        (endpointData.jwtPublicName && endpointData.jwtPublicName.length < 3) ||
        (endpointData.jwtPublicName && endpointData.jwtPublicName.length > 20)
      ) {
        setSecurityErr(
          "JWT public key name should have a length between 3 and 20."
        );
        return false;
      }
      if (
        !("jwtPublicKey" in endpointData) ||
        endpointData.jwtPublicKey === ""
      ) {
        highlight(jwtKeyRef, "border");
        setSecurityErr("Please fill JWT public key field.");
        return false;
      }
      if (
        (endpointData.jwtPublicKey && endpointData.jwtPublicKey.length < 170) ||
        (endpointData.jwtPublicKey && endpointData.jwtPublicKey.length > 800)
      ) {
        setSecurityErr(
          "JWT public key should have a length between 170 and 800."
        );
        return false;
      }
    } else {
      return true;
    }
    removeHighlight(jwtNameRef, "border");
    removeHighlight(jwtKeyRef, "border");
    removeHighlight(jwtRef, "border");
    return true;
  };

  const updateEndpointData = () => {
    if (validateSecurityDetails()) {
      setLoaderShow(true);
      setShowConfirmBtn(true);
      setModalTitle("Status");
      setBtnText("Ok");
      setIsDisabled((prev) => ({ ...prev, epSecurity: true }));

      let payload;
      if (endpointData.securityEnabled && endpointData.jwtEnabled) {
        payload = {
          id: endpointId,
          securityEnabled: endpointData.securityEnabled
            ? endpointData.securityEnabled
            : false,
          jwtEnabled: endpointData.jwtEnabled ? endpointData.jwtEnabled : false,
          jwtName: endpointData.jwtPublicName ? endpointData.jwtPublicName : "",
          jwtKey: endpointData.jwtPublicKey ? endpointData.jwtPublicKey : "",
        };
      } else {
        payload = {
          id: endpointId,
          securityEnabled: endpointData.securityEnabled
            ? endpointData.securityEnabled
            : false,
        };
      }
      apiBackendInstance
        .put(
          Urls.getUpdateEndpointNameOrSecurityUrl("security"),
          { ...payload },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response?.data?.data?.message) {
            setMessage(response.data.data.message);
            setTempEndpointData(endpointData);
          }
          setLoaderShow(false);
          setModalShow(true);
          setShowConfirmBtn(false);
        })
        .catch((err) => {
          console.error(err);
          const errMsg =
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
              ? err.response.data.message
              : "Request Failed";
          setMessage(`Error: ${errMsg}`);
          setLoaderShow(false);
          setModalShow(true);
          setShowConfirmBtn(false);
        });
    }
  };

  const copyText = (ref: any) => {
    if (ref) {
      const txt = ref?.current.innerText;
      if (txt) {
        navigator.clipboard.writeText(txt);
        setIsCopiedTxt(true);
        setTimeout(() => {
          setIsCopiedTxt(false);
        }, 1500);
      }
    }
  };

  const getconsumptionDetails = (subscriptionID: string) => {
    setLoaderShow(true);
    apiBackendInstance
      .get(Urls.getConsumptionDetailUrl(subscriptionID), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response) {
          setConsumptionDetails({
            consumptionApiUnits: response.data?.data?.consumption.apiUnits,
            quotaApiUnits: response.data?.data?.quota.apiUnits,
          });
          setLoaderShow(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoaderShow(false);
      });
  };
  const endpointDetails = () => {
    setEndpointId(id);
    setLoaderShow(true);
    let subscriptionId = "";
    apiBackendInstance
      .get(Urls.getEndpointDetailsUrl(id), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data.success) {
          setDefaultName(response.data.data.name);
          setEndpointName(response.data.data.name);
          const endpoint = {
            id: response.data.data.id,
            serviceId: response.data.data.service_id,
            endpointName: response.data.data.name,
            userId: response.data.data.user_id,
            workspaceId: response.data.data.workspace_id,
            apiKey: response.data.data.api_key,
            networkType: response.data.data.networkType,
            securityEnabled: response.data.data.security
              ? response.data.data.security.enabled
              : false,
            jwtEnabled: response.data.data.security.jwt
              ? response.data.data.security.jwt.enabled
              : false,
            jwtPublicName: response.data.data.security.jwt
              ? response.data.data.security.jwt.name
              : "",
            jwtPublicKey: response.data.data.security.jwt
              ? response.data.data.security.jwt.public_key
              : "",
            plan: response.data.data.plan ? response.data.data.plan : "",
            addOns: response.data.data.addOns ? response.data.data.addOns : [],
          };
          setEndpointData(endpoint);
          setTempEndpointData(endpoint);

          setEndpointURLs({
            http: `${Urls.getEndpointHttpUrl()}/${endpoint.apiKey}/`,
            wss: `${Urls.getEndpointWssUrl()}/${endpoint.apiKey}/`,
          });

          subscriptionId = response.data.data.subscription_id;
          if (subscriptionId) {
            getconsumptionDetails(subscriptionId);
          }
        }
        setLoaderShow(false);
      })
      .catch((err) => {
        console.error(err);
        setLoaderShow(false);
      });
  };

  useEffect(() => {
    endpointDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    validateSecurityDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpointData.jwtPublicName, endpointData.jwtPublicKey]);

  const onchangeHandler = (value: string, name: string) => {
    let res;
    const namePattern = /^[A-Za-z]([A-Za-z0-9\s-]){3,48}[A-Za-z0-9]$/;
    switch (name) {
      case "name":
        res = value.match(namePattern);
        if (!/[a-z]/i.test(value.charAt(0))) {
          removeHighlight(nameRef, "border");
          setValidationMsg(
            ErrorMessages.startWithAlphabetError("Endpoint name")
          );
          setEndpointData({ ...endpointData, endpointName: value });
          break;
        }
        if (value.length < 5) {
          setValidationMsg(ErrorMessages.minLengthError("endpoint name", 5));
          setEndpointData({ ...endpointData, endpointName: value });
          highlight(nameRef, "border");
          break;
        }
        if (value.length > 50) {
          setValidationMsg(ErrorMessages.maxLengthError("endpoint name", 50));
          setEndpointData({ ...endpointData, endpointName: value });
          highlight(nameRef, "border");
          break;
        }
        if (!/^[A-Za-z0-9]*$/.test(value.charAt(value.length - 1))) {
          setValidationMsg(
            ErrorMessages.endWithAlphanumericError("endpoint name")
          );
          setEndpointData({ ...endpointData, endpointName: value });
          highlight(nameRef, "border");
          break;
        }
        if (!res) {
          setValidationMsg(ErrorMessages.endpointNameFormat());
          setEndpointName(value);
          setEndpointData({ ...endpointData, endpointName: value });
          highlight(nameRef, "border");
          break;
        } else {
          setEndpointData({ ...endpointData, endpointName: value.trim() });
          setValidationMsg("");
          removeHighlight(nameRef, "border");
        }
        break;
      case "JwtKeyName":
        if (value === "") {
          setSecurityErr("JWT public key name should not be null");
          highlight(jwtNameRef, "border");
        }
        if (value.length < 3 || value.length > 20) {
          setSecurityErr(
            "JWT public key name should have a length between 3 and 20."
          );
          setEndpointData({ ...endpointData, jwtPublicName: value });
          highlight(jwtNameRef, "border");
        } else {
          setSecurityErr("");
          setEndpointData({ ...endpointData, jwtPublicName: value });
          removeHighlight(jwtNameRef, "border");
        }
        break;
      case "JwtKey":
        if (value === "") {
          setSecurityErr("Please fill JWT public key field.");
          highlight(jwtKeyRef, "border");
        }
        if (value.length < 170 || value.length > 800) {
          setSecurityErr(
            "JWT public key should have a length between 170 and 800."
          );
          setEndpointData({ ...endpointData, jwtPublicKey: value });
        } else {
          setSecurityErr("");
          removeHighlight(jwtKeyRef, "border");
          setEndpointData({ ...endpointData, jwtPublicKey: value });
        }

        break;
      default:
        break;
    }
  };
  const checkBoxHandler = (op: string) => {
    let value: boolean;
    if (op === "security") {
      value = endpointData.securityEnabled
        ? endpointData.securityEnabled
        : false;
      if (value) {
        setEndpointData({ ...endpointData, securityEnabled: false });
      } else {
        setEndpointData({ ...endpointData, securityEnabled: true });
      }
    }
    if (op === "jwt_enable") {
      value = endpointData.jwtEnabled ? endpointData.jwtEnabled : false;
      if (value) {
        setEndpointData({ ...endpointData, jwtEnabled: false });
      } else {
        setEndpointData({ ...endpointData, jwtEnabled: true });
      }
      setSecurityErr("");
    }
  };

  return (
    <div className="mt-5 col-12">
      <>
        <div className="my-4 editinput" id="editinput">
          <div className="row mb-3">
            <div className="col-sm-6 col-md-6 col-xl-6 col-lg-6 mx-auto">
              <label
                htmlFor="inputPassword"
                className="col-auto col-form-label fw-bold"
                style={{ fontSize: "16px" }}
              >
                Name
                <span className="text-danger">*</span>
              </label>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  id="endpoint-name"
                  name="name"
                  ref={nameRef}
                  defaultValue={endpointData.endpointName}
                  value={endpointData.endpointName}
                  disabled={isDisabled.epName}
                  onChange={(e: { target: { value: string } }) =>
                    onchangeHandler(e.target.value, "name")
                  }
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                {isDisabled.epName && (
                  <button
                    type="button"
                    className="btn btn-primary rounded "
                    onClick={() =>
                      setIsDisabled((prev) => ({ ...prev, epName: false }))
                    }
                  >
                    Edit
                  </button>
                )}
                {!isDisabled.epName && (
                  <button
                    type="button"
                    className="btn btn-secondary rounded"
                    onClick={cancelEndpointNameChange}
                  >
                    Cancel
                  </button>
                )}
                {!isDisabled.epName && (
                  <button
                    type="button"
                    className="btn btn-success rounded ms-2"
                    onClick={saveName}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-6 col-xl-6 col-lg-6 text-end pt-4">
              <div className="row">
                <div
                  className="col-8 fw-bold text-end"
                  style={{ fontSize: "16px" }}
                >
                  Network Type :-
                </div>
                <div className="col-4 text-start">
                  {endpointData.networkType}
                </div>
              </div>
              <div className="row">
                <div className="col-8 fw-bold text-end">Plan :-</div>
                <div className="col-4 text-start">
                  {endpointData.plan ? endpointData.plan : ""}
                </div>
              </div>
              <div className="row">
                <div className="col-8 fw-bold text-end">Quota :-</div>
                <div className="col-4 text-start">
                  {consumptionDetails
                    ? `${consumptionDetails?.quotaApiUnits || 0} API Units`
                    : null}
                </div>
              </div>
              <div className="row">
                <div className="col-8 fw-bold text-end">Consumption :-</div>
                <div className="col-4 text-start">
                  {consumptionDetails
                    ? `${
                        consumptionDetails?.consumptionApiUnits || 0
                      } API Units`
                    : null}
                </div>
              </div>
            </div>
          </div>
          {validationMsg && (
            <div className="text-center mb-3">
              <span style={{ color: "red" }}>{validationMsg}</span>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-4">
            <div className="card p-4 border shadow-sm h-100 endpointcard">
              <p className="text-center fw-bold" style={{ fontSize: "16px" }}>
                Endpoint
              </p>
              <p className="fw-bold my-2">HTTP</p>
              <div className="d-flex justify-content-between align-items-center p-2 rounded-2 border bg-light">
                <div
                  className=" mb-0"
                  ref={httpRef}
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  {endpointURLs.http}
                </div>
                <i
                  className="fa-regular fa-copy fs-6 text-primary cursor"
                  onClick={() => {
                    copyText(httpRef);
                  }}
                />
              </div>
              <p className="fw-bold my-2">WS</p>
              <div className="d-flex justify-content-between align-items-center p-2 rounded-2 border bg-light">
                <div
                  id="wss"
                  ref={wssRef}
                  className=" mb-0"
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  {endpointURLs.wss}
                </div>
                <i
                  className="fa-regular fa-copy fs-6 text-primary cursor"
                  onClick={() => {
                    copyText(wssRef);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-4">
            <div className="card py-4 px-4 border shadow-sm h-100">
              <p className="text-center fw-bold" style={{ fontSize: "16px" }}>
                Example for making a request
              </p>
              <p className="text-end mt-2 mb-2">
                <select
                  className="form-select"
                  defaultValue="Curl"
                  onChange={(event) => {
                    const selected = event.currentTarget
                      .value as codeSnippetType;
                    if (selected === "WSCAT") setCodeType("wss");
                    else setCodeType("https");
                    setCodeSnippet(selected);
                  }}
                >
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
                </ul>
                <div className="d-flex justify-content-between gap-2">
                  <pre>
                    <code className="" ref={codeRef}>
                      {codeType === "https" &&
                        codes.find((code) => codeSnippet === code.lang)?.http}

                      {codeType === "wss" &&
                        codes.find((code) => codeSnippet === code.lang)?.wss}
                    </code>
                  </pre>
                  <span>
                    <i
                      aria-hidden
                      className="fa-regular fa-copy fs-6 cursor text-primary p-2"
                      onClick={() => {
                        copyText(codeRef);
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      {isCopiedTxt && (
        <div
          style={{ width: "50%" }}
          className="alert alert-success mt-3 mb-5"
          role="alert"
        >
          Copied
        </div>
      )}
      <div className="my-5">
        <div className="d-flex align-items-center justify-content-between col-sm-6 pe-2">
          <div
            className="form-check form-switch"
            title={isDisabled.epSecurity ? "Enable edit from above" : "sdd"}
          >
            <label
              className="form-check-label fw-bold"
              htmlFor="flexSwitchCheckChecked"
            >
              SECURITY
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckChecked"
              disabled={isDisabled.epSecurity}
              checked={endpointData.securityEnabled}
              name="security"
              onChange={() => checkBoxHandler("security")}
            />
          </div>

          <div>
            {isDisabled.epSecurity && (
              <button
                type="button"
                className="btn btn-primary rounded me-2"
                onClick={() =>
                  setIsDisabled((prev) => ({ ...prev, epSecurity: false }))
                }
              >
                Edit
              </button>
            )}

            {!isDisabled.epSecurity && (
              <button
                type="button"
                className="btn btn-secondary rounded me-2"
                onClick={cancelSecurityChange}
              >
                Cancel
              </button>
            )}

            {!isDisabled.epSecurity && (
              <button
                type="button"
                className="btn btn-success rounded me-2"
                onClick={updateEndpointData}
              >
                Save
              </button>
            )}
          </div>
        </div>

        <h6 className="my-4">JWT</h6>
        <div className="col-xl-4 col-lg-5 col-sm-8 col-md-8">
          <div className="form-check mb-3 editinput" id="editinput3">
            <input
              className="form-check-input"
              type="checkbox"
              name="jwt_enable"
              id="require-jwt"
              ref={jwtRef}
              disabled={
                !(
                  isDisabled.epSecurity === false &&
                  endpointData.securityEnabled === true
                )
              }
              checked={endpointData.jwtEnabled}
              onChange={() => checkBoxHandler("jwt_enable")}
            />
            <label className="form-check-label ms-2">Require JWT</label>
            <i
              title="Restrict API usage to requests that include a valid JWT"
              className="fa-solid fa-circle-info ms-1"
            />
          </div>
        </div>
        <div className="mb-2 row editinput" id="editinput4">
          <label
            htmlFor=""
            className="col-sm-12 col-md-4 col-lg-2 col-xl-2 col-form-label col-6"
          >
            JWT Public Key Name
            <span className="text-danger">*</span>
          </label>
          <div className="col-sm-12 col-md-6 col-xl-4 col-lg-5 col-12">
            <input
              type="text"
              className="form-control"
              name="JwtKeyName"
              id="jwt-key-name"
              ref={jwtNameRef}
              defaultValue={endpointData.jwtPublicName}
              disabled={
                !(
                  isDisabled.epSecurity === false &&
                  endpointData.jwtEnabled === true
                )
              }
              onChange={(e: { target: { value: string } }) =>
                onchangeHandler(e.target.value, "JwtKeyName")
              }
            />
          </div>
        </div>
        <div className="mb-3 row editinput" id="editinput2">
          <label
            htmlFor=""
            className="col-sm-12 col-md-4 col-lg-2 col-xl-2 col-form-label col-6"
          >
            JWT Public Key
            <span className="text-danger">*</span>
            <i
              title="Restrict API usage to requests that include a valid JWT. Public key can be generated using RSA and ECDSA algorithms only."
              className="fa-solid fa-circle-info ms-1"
            />
          </label>

          <div className="col-sm-12 col-md-6 col-xl-4 col-lg-5 col-12">
            <textarea
              rows={4}
              cols={50}
              className="form-control "
              name="JwtKey"
              id="jwt-key"
              ref={jwtKeyRef}
              placeholder={
                endpointData.jwtEnabled === true
                  ? "-----BEGIN PUBLIC KEY----------END PUBLIC KEY-----"
                  : ""
              }
              defaultValue={endpointData.jwtPublicKey}
              disabled={
                !(
                  isDisabled.epSecurity === false &&
                  endpointData.jwtEnabled === true
                )
              }
              onChange={(e) => onchangeHandler(e.target.value, "JwtKey")}
            />
          </div>
        </div>
        {securityErr ? (
          <div className="text-center">
            <p className="text-danger py-2">{securityErr}</p>
          </div>
        ) : null}
      </div>
      <CustomLoader showLoader={loaderShow} />
      <Modal
        confirmBtnText={btnText}
        onHide={() => {
          setModalShow(false);
          setModalTitle("");
          setMessage("");
        }}
        onConfirm={() => {
          router.refresh()
          // window.location.reload();
        }}
        show={modalShow}
        disableConfirmBtn={false}
        visibleFooter
        title={modalTitle}
        visibleConfirmBtn={showConfirmBtn}
        visibleFooterCloseButton
        visibleHeaderCloseIcon={false}
      >
        <p className="mt-3 p-1 text-center">{message}</p>
      </Modal>
    </div>
  );
};

export default EndpointDetails;
