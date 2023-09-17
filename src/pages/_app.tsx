import { type AppProps } from "next/app";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type ReactElement } from "react";
import { Inter } from "next/font/google";

const nabla = Inter({ subsets: [], preload: true });

const queryClient = new QueryClient();

const globalStyles = `
  html {
    font-family: ${nabla.style.fontFamily};
    font-size: 44px;
    background: #096345;
    user-select: none;
  }

  body {
    padding: 5%;
  }

  button {
    background: #096345;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  select {
    background: #096345;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
  }

  input {
    background: #096345;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
  }

  .pokemon-list {
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .pokemon-item {
    border-radius: 10px;
    padding: 20px;
    border: 1px solid #fff;
    margin: 10px;
    text-transform: capitalize;
  }

  .pokemon-item:hover {
    background: #4e9a6f;
  }
`;

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
  <QueryClientProvider client={queryClient}>
    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */}
    <Hydrate state={pageProps.dehydratedState}>
      <style jsx global>
        {globalStyles}
      </style>
      <Component {...pageProps} />
    </Hydrate>
  </QueryClientProvider>
);

export default MyApp;
