'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import styles from '../styles/contact.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/contacts', formData);
      if (res.status === 200 || res.status === 201) {
        setStatus({ success: true, message: '✅ Bạn đã góp ý thành công!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ success: false, message: '❌ Gửi không thành công, thử lại sau.' });
      }
    } catch (error) {
      console.error('❌ Lỗi gửi liên hệ:', error);
      setStatus({ success: false, message: '❌ Có lỗi xảy ra, vui lòng thử lại.' });
    }
  };

  return (
    <>
      {/* ✅ Tách banner ra ngoài container */}
      <div className={styles.bannerWrapper}>
        <Image
          src="/img/diadiem2.jpg"
          alt="Liên hệ"
          fill
          className={styles.bannerImage}
          unoptimized
          priority
        />
      </div>

      <div className={styles.contactContainer}>
        <h1 className={styles.title}>Liên hệ với chúng tôi</h1>
        <p className={styles.subtitle}>XIN VUI LÒNG ĐIỀN VÀO BIỂU MẪU LIÊN HỆ CỦA CHÚNG TÔI</p>

        <div className={styles.formWrapper}>
          <div className={styles.logoContainer}>
            <Image src="/img/logomini.png" alt="Logo Huế" width={300} height={300} />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Tên của bạn" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="subject" placeholder="Chủ đề" value={formData.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Tin nhắn" value={formData.message} onChange={handleChange} required />
            <button type="submit">SUBMIT</button>
          </form>

          {status.message && (
            <p className={status.success ? styles.success : styles.error}>
              {status.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
