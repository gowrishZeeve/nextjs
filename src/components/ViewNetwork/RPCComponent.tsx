interface props {
  rpcList: string[];
}
const RpcComponent = ({ rpcList }: props) => {
  const rpcOptions = ["eth", "net", "web3", "admin", "db", "miner"];
  return (
    <div className="mt-4  px-3">
      <h6>JSON RPC APIs</h6>
      <div className="row mt-3 ms-2">
        {rpcOptions.map((d, idx) => (
          <div
            key={`custom-checkbox-apis-${idx.toString()}`}
            className="form-check col-xl-3 col-lg-3 col-sm-6 mb-3 col-md-3 RPCspace1"
          >
            <input
              type="checkbox"
              className="form-check-input"
              id={`custom-rpc-${d}`}
              disabled
              checked={rpcList.includes(d)}
            />
            <label
              className="form-check-label mx-2"
              htmlFor={`custom-rpc-${d}`}
            >
              {d}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RpcComponent;
