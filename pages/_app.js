import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  // Directly returns the clean component cascade
  return <Component {...pageProps} />;
}
