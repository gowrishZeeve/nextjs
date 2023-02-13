import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network";
import { nanoid } from "nanoid";
import servericonReady from "@/assets/server-icon-3-2.png";
import servericonStop from "@/assets/server-icon-stop.png";
import servericonPending from "@/assets/server-icon-pending.png";
import { network } from "@/components/ViewNetwork/ViewNetworkBody";

interface prop {
  Data: network[];
}
const VisNetwork = ({ Data }: prop) => {
  // A reference to the div rendered by this component
  const domNode = useRef<any>();

  // A reference to the vis network instance
  const networkDiv = useRef<any>();

  const setImages = (str: string) => {
    switch (str.toLowerCase()) {
      case "ready":
        return servericonReady.src;
      case "provisioning":
        return servericonPending.src;
      case "0":
        return servericonStop.src;
      default:
        return servericonStop.src;
    }
  };
  const obj = [];
  for (let i = 0; i < Data.length; i += 1) {
    const x = {
      id: i + 1,
      label: `${Data[i].node_name}`,
      image: setImages(Data[i].status),
      shape: "image",
    };
    obj.push(x);
  }
  const nodes = new DataSet(obj);
  // An array of edges
  const egd = [];
  const n = Data.length;
  for (let i = 1; i <= n; i += 1) {
    for (let k = i + 1; k <= n + 1; k += 1) {
      const z = { id: nanoid(), from: i, to: k };
      egd.push(z);
    }
  }
  const edges = new DataSet(egd);

  const options = {
    height: "500px",
    width: "100%",
  };

  useEffect(() => {
    const data = {
      nodes,
      edges,
    };
    networkDiv.current = new Network(domNode.current, data, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={domNode} />;
};

export default VisNetwork;
