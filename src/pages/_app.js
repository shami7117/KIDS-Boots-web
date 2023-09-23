import Navbar from '@/components/navbar/Navbar'
import '@/styles/globals.css'
import Footer from "@/components/footer/Footer"
import { Montserrat } from 'next/font/google'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from 'next/head'; // Import the Head component from Next.js
import { SearchProvider } from '../components/navbar/searchContext';
import { useRouter } from 'next/router';
import Script from 'next/script'


// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

const font = Montserrat({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const items = router.query.Currency;
  const currency = items === undefined || items === "USD" ? "USD" : "EUR"
  console.log("APP JS CURRENCY", items)

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <div className={font.className}>
          <Head>
            {/* Define meta tags, title, and linked stylesheets here */}
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Kids-Boots</title>
            <link rel="stylesheet" href="/path/to/your.css" />
            <script src="https://www.paypal.com/sdk/js?client-id=AYFGcFd7MjvD1zxRn3xBEDUHQoeFld3JcKI6_UtOwNtjzcSwQq1TbbymBaApxyH8vcBFbKcXk6A4Sm2d&currency=USD"></script>

          </Head>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </SearchProvider>
    </QueryClientProvider>
  );
}







