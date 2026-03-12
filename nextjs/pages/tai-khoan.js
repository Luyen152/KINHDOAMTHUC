// nextjs/pages/tai-khoan.js
import Head from 'next/head';
import AccountAddressForm from '../components/AccountAddressForm';
import OrderStatusPanel from '../components/OrderStatusPanel';

export default function TaiKhoanPage() {
  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 12px' }}>
      <Head><title>Tài khoản</title></Head>
      <h1 style={{ marginBottom: 16 }}>Tài khoản của tôi</h1>
      <AccountAddressForm />
      <OrderStatusPanel />
    </div>
  );
}
