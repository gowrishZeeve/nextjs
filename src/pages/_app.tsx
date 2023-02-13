import "@/styles/globals.css";
import { AppProps } from "next/app";
import Wrapper from "./_wrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Wrapper>
      <Component {...pageProps} />;
    </Wrapper>
  );
}
