import { Loader } from "@/components/Loader";
import loader from "@/assets/spinner.svg";

interface props {
  showLoader: boolean;
}
const CustomLoader = ({ showLoader }: props) => (
  <div>{showLoader && <Loader imagePath={loader} />}</div>
);
export default CustomLoader;
