// pages/kinhdo.js
import Head from 'next/head';
import Script from 'next/script';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

import KinhDoHero from '../templates/KinhDoHero';
import KinhDoIntro from '../templates/KinhDoIntro';
import KinhDoFoodIntro from '../templates/KinhDoFoodIntro';
import KinhDoCulture from '../templates/KinhDoCulture';
import KinhDoMonNgon from '../templates/KinhDoMonNgon';

export default function KinhDoPage() {
  return (
    <>
      <Head>
        <title>Ẩm Thực Huế - Kinh Đô</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
          rel="stylesheet"
        /> */}
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
        integrity="sha384-ENjdO4Dr2bkBIFxQpeoVZEVkRjQAnYhEzUWZm3N1YkGZ1yMGGZ1G0E70gN3gmRMo"
        crossOrigin="anonymous"
      />

      <Header />
      <KinhDoHero />
      <KinhDoIntro />
      <KinhDoFoodIntro />
      <KinhDoCulture />
      <KinhDoMonNgon />
      <Footer />
    </>
  );
}
