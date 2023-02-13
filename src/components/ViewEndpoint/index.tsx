import { useState } from "react";
import { Modal } from "@/components/Modal";
import Breadcrumb from "@/components/BreadCrumb";
import ethereumLogo from "@/assets/ethereum.svg";
import CustomLoader from "@/components/CustomLoader";
import Urls from "@/utils/baseURLs";
import apiBackendInstance from "@/utils/axios";
import userImg from "@/assets/user.svg";
import cloudImg from "@/assets/SoundCloud.png";
import Metrics from "@/components/ViewEndpoint/Metrics";
import EndpointDetails from "@/components/ViewEndpoint/Details";
import Image from "next/image";

interface props {
  id: string;
}
const ViewEndpointBody = ({ id }: props) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [loaderShow, setLoaderShow] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>(
    "Are you sure you want to delete endpoint?"
  );
  const [message, setMessage] = useState<string>("");
  const [inActive, setInActive] = useState(false);
  const [endpointName, setEndpointName] = useState<string>("My Endpoint");
  const [showConfirmBtn, setShowConfirmBtn] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Basics");

  const paths = [
    { name: "Home", path: Urls.getDashboardUrl() },
    { name: "Endpoint", path: Urls.getEndpointsUrl() },
  ];

  const clickOnTab = (value: string) => {
    setActiveTab(value);
  };

  const deleteEndpoint = async () => {
    setLoaderShow(true);
    setInActive(true);
    setModalTitle("Status");
    setShowConfirmBtn(true);
    apiBackendInstance
      .delete(Urls.getEndpointDetailsUrl(id), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          setMessage(response.data.data.message);
        }
        setShowConfirmBtn(false);
        if (response.data.success) {
          setTimeout(() => {
            window.open(Urls.getDashboardUrl(), "_self");
          }, 3000);
        }
        setLoaderShow(false);
        setInActive(false);
      })
      .catch((err) => {
        console.error(err);
        const errMsg =
          err && err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Request Failed";
        setMessage(`Error: ${errMsg}`);
        setInActive(false);
        setLoaderShow(false);
        setShowConfirmBtn(false);
      });
  };

  return (
    <section className="px-5 col-xl-10 col-lg-10 col-md-9 col-sm-8 workspace w-100 h-100">
      <div className="mt-5 col-11 mx-auto">
        <Image src={ethereumLogo} alt="avalanche-logo" className="mb-3" />
        <div className="row align-items-center">
          <div className="col-6">
            <Breadcrumb
              prefixLink={paths}
              activeLink={endpointName}
              textSize={13}
            />
          </div>
          <div className="col-6 text-end cursor">
            <i
              className="fa-regular fa-trash-can fs-5"
              aria-hidden
              onClick={() => setModalShow(true)}
            />
          </div>
        </div>

        <div className="col-12 mt-5">
          <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`px-4 nav-link ${
                  activeTab === "Basics" ? "active" : ""
                }`}
                id="home-tab"
                data-bs-toggle="tab"
                type="button"
                role="tab"
                onClick={() => clickOnTab("Basics")}
              >
                <Image src={userImg} alt="" className="px-1" />
                <span className="align-middle">Basics</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`px-4 nav-link ${
                  activeTab === "Matrics" ? "active" : ""
                }`}
                id="profile-tab"
                data-bs-toggle="tab"
                type="button"
                role="tab"
                onClick={() => clickOnTab("Matrics")}
              >
                <Image src={cloudImg} alt="" className="px-1" />
                <span className="align-middle">Metrics</span>
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div>
              <div className="mt-3">
                {activeTab === "Basics" && (
                  <EndpointDetails setEndpointName={setEndpointName} id={id} />
                )}
              </div>
            </div>
            <div>{activeTab === "Matrics" && <Metrics id={id} />}</div>
          </div>
        </div>
      </div>
      <CustomLoader showLoader={loaderShow} />
      <Modal
        confirmBtnText="Confirm"
        onHide={() => {
          setModalShow(false);
          setModalTitle("Are you sure you want to delete endpoint?");
          setMessage("");
        }}
        onConfirm={() => {
          deleteEndpoint();
        }}
        show={modalShow}
        disableConfirmBtn={inActive}
        visibleFooter
        title={modalTitle}
        visibleConfirmBtn={showConfirmBtn}
        visibleFooterCloseButton
        visibleHeaderCloseIcon={false}
      >
        <p className="mt-3 p-1 text-center">{message}</p>
      </Modal>
    </section>
  );
};

export default ViewEndpointBody;
