// pages/contact.js
import Head from 'next/head';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ContactForm from '../templates/ContactForm';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Liên hệ với chúng tôi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <ContactForm />
      <Footer />
    </>
  );
}
