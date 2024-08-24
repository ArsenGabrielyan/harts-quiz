import Head from "next/head";
import "@/styles/globals.scss"
import 'react-toastify/dist/ReactToastify.min.css';
import "react-multi-carousel/lib/styles.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-theme";

export default function App({Component, pageProps}){
     return <>
     <Head>
          <meta name="description" content="Quiz Application Called Harts"/>
          <link rel="shortcut icon" href="/favicon.ico"/>
          <title>Հարց</title>
     </Head>
     <ThemeProvider attribute="class">
          <SessionProvider session={pageProps.session}>
               <Component {...pageProps} />
               <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover draggable theme="colored"/>
          </SessionProvider>
     </ThemeProvider>
     </>
}