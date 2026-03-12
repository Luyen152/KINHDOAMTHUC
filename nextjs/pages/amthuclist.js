// pages/amthuclist.js
import Head from 'next/head';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import AmThucList from '../templates/AmThucList';

export default function AmThucListPage() {
  return (
    <>
      <Head>
        <title>Ẩm thực Huế - Danh sách món ngon</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <AmThucList />
      <Footer />
    </>
  );
}
