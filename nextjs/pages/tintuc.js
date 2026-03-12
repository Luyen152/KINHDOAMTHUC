// pages/tintuc.js
import Head from 'next/head';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import TinTucList from '../templates/TinTucList';  // Import TinTucList

export default function TinTucPage() {
  return (
    <>
      <Head>
        <title>Tin tức - Ẩm thực Huế</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <TinTucList /> {/* Tin tức */}
      <Footer />
    </>
  );
}
