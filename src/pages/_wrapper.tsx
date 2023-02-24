// import "@/styles/inappNotification.css";
import { prefixPath } from "@/utils/helpers";
import { globalConfig, globalConfigUrl } from "@/config/appConfig";
import apiBackendInstance from "@/utils/axios";
import axios from "axios";
import TokenManager from "@zeeve-platform/login-utility";
import InAppNotificationsManager from "@/components/InAppNotification";
import Urls from "@/utils/baseURLs";
import { useEffect, useState } from "react";

export interface WrapperProps extends React.PropsWithChildren {}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  useEffect(() => {
    axios
      .get(prefixPath("/api/config"))
      .then((response) => {
        console.log("config", response.data)
        globalConfig.config = response.data;
      })
      .then(() => {
        if (
          Urls.getBackendUrl() === undefined ||
          Urls.getBackendUrl() === null
        ) {
          throw new Error("Backend URL not found in config");
        }
      })
      .then(() =>
        TokenManager.createInstance(Urls.getAuthUrl(), apiBackendInstance,'local')
      )
      .then(
        () =>
          new Promise((resolve) => {
            const token = TokenManager.getInstance().getAccessToken();
            InAppNotificationsManager.createInstance(
              Urls.getInappNotificationsUrl(token),
              {
                InaApp: {},
              }
            );
            TokenManager.getInstance().updateCallbacks({
              accessTokenRotationCallbacks: {
                onAccessTokenUpdate: (access_token) => {
                  // update notifications manager ws address with newer token whenever a token is rotated
                  InAppNotificationsManager.getInstance().updateWsAddress(
                    Urls.getInappNotificationsUrl(access_token)
                  );
                },
              },
            });
            resolve("ok");
          })
      )
      .then(() => {})
      .catch((error) => {
        console.log("config file missing -", error);
      });
  }, []);

  return <>{children}</>;
};

export default Wrapper;
