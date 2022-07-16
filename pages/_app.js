import "../styles/globals.css"
import { Provider } from "react-redux"
import store from "../redux/store"
import Head from "next/head"
import Script from "next/script"
import React, { useEffect } from "react"
import { setCurrentUser, addToDB } from "../redux/features/authSlice"
import { getAllUsers } from "../redux/features/peopleSlice"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import ThemeCustomProvider from "../components/ThemeCustomProvider"
import { auth } from "../firebase_connect"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import Router from "next/router"

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
})

Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

// store.dispatch(getAllUsers());

function MyApp({ Component, pageProps }) {
  const Layout = Component?.Layout ? Component.Layout : React.Fragment

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      var data
      if (user) {
        data = {
          username: user.displayName,
          photoUrl: user.photoURL,
          email: user.email,
          uid: user.uid,
        }
        store.dispatch(addToDB(data))
      }
      store.dispatch(setCurrentUser(data))
      // console.log("chg: ", data)
    })

    return unsubscribe
  }, [])

  return (
    <Provider store={store}>
      <ThemeCustomProvider>
        <Layout>
          <Head>
            <title>Recommend you</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta
              name="description"
              content="a movie recommendation and social networking web app"
            />
            {/*  WEB PAGE ICON */}
            <link
              rel="apple-touch-icon"
              sizes="57x57"
              href="/site-icon/apple-icon-57x57.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="60x60"
              href="/site-icon/apple-icon-60x60.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="72x72"
              href="/site-icon/apple-icon-72x72.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="76x76"
              href="/site-icon/apple-icon-76x76.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="114x114"
              href="/site-icon/apple-icon-114x114.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="120x120"
              href="/site-icon/apple-icon-120x120.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="144x144"
              href="/site-icon/apple-icon-144x144.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="152x152"
              href="/site-icon/apple-icon-152x152.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/site-icon/apple-icon-180x180.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="192x192"
              href="/site-icon/android-icon-192x192.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/site-icon/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="96x96"
              href="/site-icon/favicon-96x96.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/site-icon/favicon-16x16.png"
            />
            <link rel="manifest" href="/site-icon/manifest.json" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta
              name="msapplication-TileImage"
              content="/site-icon/ms-icon-144x144.png"
            />
            <meta name="theme-color" content="#ffffff"></meta>
            {/* END OF WEB PAGE ICON */}
            <link
              href="https://cdn.lineicons.com/3.0/lineicons.css"
              rel="stylesheet"
            ></link>
          </Head>

          {/* Version -6  */}
          <Script
            src="https://kit.fontawesome.com/dafaabb6b4.js"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
          <Script
            type="module"
            src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
            defer
          />
          <Script src="https://apps.elfsight.com/p/platform.js" defer />

          <Component {...pageProps} />
        </Layout>
      </ThemeCustomProvider>
    </Provider>
  )
}

export default MyApp
