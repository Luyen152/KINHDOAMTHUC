// pages/admin.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/admin.module.css';

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

const STATUS = {
  CART: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  DELIVERED: 'Đã giao',
  RECEIVED: 'Đã nhận',
  CANCELED: 'Đã hủy',
};

export default function AdminPage() {
  // ====== STATE ======
  const [active, setActive] = useState('dashboard'); // 'dashboard' | 'revenue' | 'users' | 'orders' | 'products'

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: '', role: 0 });
  const [editingId, setEditingId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [dishForm, setDishForm] = useState({
    name: '', slug: '', price: '', description: '', image: '', is_featured: false
  });
  const [editingDishId, setEditingDishId] = useState(null);

  const [statusDraft, setStatusDraft] = useState({});
  const [range, setRange] = useState({ from: '', to: '' });
  const [productStats, setProductStats] = useState([]);
  const [revenueDaily, setRevenueDaily] = useState([]);
  const [kpi, setKpi] = useState({ totalRevenue: 0, totalOrders: 0, aov: 0 });

  // ====== LOAD DATA ======
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { setLoading(false); return; }
    fetchUsers(token);
    fetchOrders(token);
    fetchDishes();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    const t = setInterval(() => fetchOrders(token), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to, orders]);

  // ====== API ======
  const fetchUsers = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users || []);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi lấy danh sách người dùng:', err);
      setLoading(false);
    }
  };

  const fetchOrders = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/api/donhang/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      setOrders(list);
      setStatusDraft({});
    } catch (err) {
      console.error('Lỗi lấy danh sách đơn hàng:', err);
    }
  };

  const fetchDishes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dishes`);
      setDishes(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy danh sách món ăn:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const qs = new URLSearchParams();
      if (range.from) qs.append('from', range.from);
      if (range.to) qs.append('to', range.to);

      const [byProductRes, dailyRes] = await Promise.all([
        axios.get(`${API_BASE}/api/stats/product-sales?${qs.toString()}`),
        axios.get(`${API_BASE}/api/stats/revenue-daily?${qs.toString()}`)
      ]);

      const byProduct = byProductRes.data?.data || [];
      const daily = dailyRes.data?.data || [];

      setProductStats(byProduct);
      setRevenueDaily(daily);

      const totalRevenue = byProduct.reduce((s, r) => s + Number(r.doanh_thu || 0), 0);

      const totalOrdersAPI = daily.reduce((s, r) => s + Number(r.so_don || 0), 0);
      const fallbackOrders = orders.filter(o => {
        const d = o.ngay_dat ? new Date(o.ngay_dat) : null;
        if (!d) return false;
        const fromOk = range.from ? d >= new Date(`${range.from}T00:00:00`) : true;
        const toOk = range.to ? d < new Date(new Date(`${range.to}T00:00:00`).getTime() + 86400000) : true;
        const valid = ['Đã xác nhận', 'Đã giao', 'Đã nhận'].includes(o.trang_thai || o.status);
        return fromOk && toOk && valid;
      }).length;

      const totalOrders = totalOrdersAPI || fallbackOrders;
      const aov = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

      setKpi({ totalRevenue, totalOrders, aov });
    } catch (err) {
      console.error('Lỗi lấy thống kê:', err);
    }
  };

  const handleOrderStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(
        `${API_BASE}/api/donhang/cap-nhat-trang-thai`,
        { id, trang_thai: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders(token);
      await fetchStats();
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái đơn hàng:', err);
      alert('Cập nhật trạng thái thất bại. Vui lòng thử lại!');
    }
  };

  const handleMarkReceived = async (order) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(
        `${API_BASE}/api/donhang/cap-nhat-trang-thai`,
        { id: order.id, trang_thai: STATUS.RECEIVED },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders(token);
      await fetchStats();
    } catch (err) {
      console.error('Lỗi đánh dấu Đã nhận:', err);
      alert('Không thể đánh dấu Đã nhận. Kiểm tra log.');
    }
  };

  // ====== USER CRUD ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const payload = { ...form };

    if (!editingId && !form.password) {
      alert('Vui lòng nhập mật khẩu khi thêm mới!');
      return;
    }
    if (editingId) delete payload.password;

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/users/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE}/api/users`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: '', email: '', password: '', avatar: '', role: 0 });
      setEditingId(null);
      fetchUsers(token);
    } catch (err) {
      console.error('Lỗi tạo/cập nhật người dùng:', err);
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
      role: user.role ?? 0,
      password: ''
    });
    setEditingId(user.id);
    setActive('users');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    if (confirm('Bạn chắc chắn muốn xoá user này?')) {
      try {
        await axios.delete(`${API_BASE}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(token);
      } catch (err) {
        console.error('Lỗi xoá người dùng:', err);
      }
    }
  };

  // ====== DISH CRUD ======
  const handleDishSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...dishForm,
        price: dishForm.price === '' ? '' : Number(dishForm.price)
      };
      if (editingDishId) {
        await axios.put(`${API_BASE}/dishes/${editingDishId}`, payload);
      } else {
        await axios.post(`${API_BASE}/dishes`, payload);
      }
      setDishForm({ name: '', slug: '', price: '', description: '', image: '', is_featured: false });
      setEditingDishId(null);
      fetchDishes();
    } catch (err) {
      console.error('Lỗi xử lý món ăn:', err);
    }
  };

  const handleDishEdit = (dish) => {
    setDishForm({
      id: dish.id,
      name: dish.name || '',
      slug: dish.slug || '',
      price: dish.price ?? '',
      description: dish.description || '',
      image: dish.image || '',
      is_featured: !!dish.is_featured
    });
    setEditingDishId(dish.id);
    setActive('products');
  };

  const handleDishDelete = async (id) => {
    if (confirm('Bạn có chắc chắn xoá món này?')) {
      try {
        await axios.delete(`${API_BASE}/dishes/${id}`);
        fetchDishes();
      } catch (err) {
        console.error('Lỗi xoá món ăn:', err);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(`${API_BASE}/upload/dish-image`, formData);
      setDishForm((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
    }
  };

  // ====== CHART DATA ======
  const numberVN = (n) => (Number(n || 0)).toLocaleString('vi-VN');

  const productChartData = {
    labels: productStats.map(x => x.ten_san_pham),
    datasets: [
      { label: 'Doanh thu (VND)', data: productStats.map(x => x.doanh_thu), yAxisID: 'y1', borderWidth: 1 },
      { label: 'Lượt bán (SL)', data: productStats.map(x => x.so_luong_ban), yAxisID: 'y2', borderWidth: 1 },
    ],
  };
  const productChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Doanh thu & Lượt bán theo sản phẩm' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const ds = ctx.dataset, v = ctx.raw;
            return ds.yAxisID === 'y1'
              ? `${ds.label}: ${numberVN(v)} đ`
              : `${ds.label}: ${numberVN(v)}`;
          }
        }
      }
    },
    interaction: { mode: 'index', intersect: false },
    scales: {
      y1: {
        type: 'linear', position: 'left', title: { display: true, text: 'VND' },
        ticks: { callback: (v) => numberVN(v) }, grid: { drawOnChartArea: false }
      },
      y2: {
        type: 'linear', position: 'right', title: { display: true, text: 'Số lượng' },
        ticks: { callback: (v) => numberVN(v) }
      },
    }
  };

  const dailyChartData = {
    labels: revenueDaily.map(x => x.ngay),
    datasets: [{ label: 'Doanh thu (VND)', data: revenueDaily.map(x => x.doanh_thu), borderWidth: 2, tension: 0.3 }],
  };
  const dailyChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Doanh thu theo ngày' },
      tooltip: { callbacks: { label: (ctx) => `Doanh thu: ${numberVN(ctx.raw)} đ` } }
    },
    scales: { y: { ticks: { callback: (v) => numberVN(v) } } }
  };

  // ====== FILTERED ORDERS ======
  const filteredOrders = (() => {
    let list = orders;
    if (selectedUserId) list = list.filter(o => String(o.id_nguoi_dung) === String(selectedUserId));
    if (statusFilter) list = list.filter(o => (o.trang_thai || o.status) === statusFilter);
    return list;
  })();

  // ====== RENDER HELPERS ======
  const TitleMap = {
    dashboard: 'Tổng quan',
    revenue: 'Doanh thu',
    users: 'Quản lý người dùng',
    orders: 'Quản lý đơn hàng',
    products: 'Quản lý sản phẩm',
  };

  // ====== CONTENT SECTIONS ======
  const DashboardSection = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.orange}`} onClick={() => setActive('revenue')} role="button">
          <div className={styles.statValue}>{numberVN(kpi.totalRevenue)} đ</div>
          <div className={styles.statLabel}>Doanh thu</div>
          <button className={styles.statAction}>Chi tiết</button>
        </div>
        <div className={`${styles.statCard} ${styles.green}`} onClick={() => setActive('users')} role="button">
          <div className={styles.statValue}>{users.length}</div>
          <div className={styles.statLabel}>Danh sách người dùng</div>
          <button className={styles.statAction}>Chi tiết</button>
        </div>
        <div className={`${styles.statCard} ${styles.cyan}`} onClick={() => setActive('orders')} role="button">
          <div className={styles.statValue}>{orders.length}</div>
          <div className={styles.statLabel}>Danh sách đơn hàng</div>
          <button className={styles.statAction}>Chi tiết</button>
        </div>
        <div className={`${styles.statCard} ${styles.red}`} onClick={() => setActive('products')} role="button">
          <div className={styles.statValue}>{dishes.length}</div>
          <div className={styles.statLabel}>Quản lý sản phẩm</div>
          <button className={styles.statAction}>Chi tiết</button>
        </div>
      </div>
    </>
  );

  const RevenueSection = () => (
    <>
      <h4 className="mt-2">📊 Doanh thu</h4>
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Từ ngày</label>
          <input type="date" className="form-control"
            value={range.from}
            onChange={(e) => setRange(prev => ({ ...prev, from: e.target.value }))} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Đến ngày</label>
          <input type="date" className="form-control"
            value={range.to}
            onChange={(e) => setRange(prev => ({ ...prev, to: e.target.value }))} />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-outline-secondary w-100"
            onClick={() => setRange({ from: '', to: '' })}>Xóa lọc</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold text-muted">Tổng doanh thu</div>
              <div className="fs-3">{numberVN(kpi.totalRevenue)} đ</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold text-muted">Tổng đơn</div>
              <div className="fs-3">{numberVN(kpi.totalOrders)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold text-muted">AOV (đơn TB)</div>
              <div className="fs-3">{numberVN(kpi.aov)} đ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card">
            <div className={`card-body ${styles.chartBox}`}>
              {productStats.length ? <Bar data={productChartData} options={productChartOptions} /> :
                <div className="text-muted">Chưa có dữ liệu sản phẩm.</div>}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card">
            <div className={`card-body ${styles.chartBox}`}>
              {revenueDaily.length ? <Line data={dailyChartData} options={dailyChartOptions} /> :
                <div className="text-muted">Chưa có dữ liệu theo ngày.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const UsersSection = () => (
    <>
      <h2>👤 Quản lý người dùng</h2>
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Họ tên"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="password" placeholder="Mật khẩu"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Avatar URL"
            value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
        </div>
        <div className="col-md-1">
          <select className="form-select" value={form.role}
            onChange={(e) => setForm({ ...form, role: parseInt(e.target.value, 10) })}>
            <option value={0}>User</option>
            <option value={1}>Admin</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </form>

      <h4 className="mt-4">📋 Danh sách người dùng</h4>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Avatar</th>
            <th>Role</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {u.avatar
                  ? <img src={u.avatar} width="40" height="40" alt="avatar" style={{ borderRadius: '50%' }} />
                  : 'N/A'}
              </td>
              <td>{u.role === 1 ? 'Admin' : 'User'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u)}>✏️</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const OrdersSection = () => (
    <>
      <h4 className="mt-2">📦 Quản lý đơn hàng</h4>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="me-2">Lọc theo người dùng:</label>
          <select className="form-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">Tất cả</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="me-2">Lọc theo trạng thái:</label>
          <select className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value={STATUS.CART}>{STATUS.CART}</option>
            <option value={STATUS.CONFIRMED}>{STATUS.CONFIRMED}</option>
            <option value={STATUS.DELIVERED}>{STATUS.DELIVERED}</option>
            <option value={STATUS.RECEIVED}>{STATUS.RECEIVED}</option>
            <option value={STATUS.CANCELED}>{STATUS.CANCELED}</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động nhanh</th>
            <th>Lưu</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr><td colSpan="7" className="text-center text-muted">Chưa có đơn hàng.</td></tr>
          )}
          {orders.map(order => {
            const current = order.trang_thai || order.status;
            const draftValue = statusDraft[order.id] ?? current;
            const isCanceled = draftValue === STATUS.CANCELED;
            const canMarkReceived = current === STATUS.DELIVERED;

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.id_nguoi_dung}</td>
                <td>{order.ngay_dat ? new Date(order.ngay_dat).toLocaleString('vi-VN') : '-'}</td>
                <td>{Number(order.tong_tien || 0).toLocaleString('vi-VN')} đ</td>
                <td style={{ minWidth: 180 }}>
                  <select
                    className="form-select"
                    value={draftValue}
                    disabled={isCanceled}
                    onChange={(e) =>
                      setStatusDraft(prev => ({ ...prev, [order.id]: e.target.value }))
                    }
                  >
                    <option value={STATUS.CART}>{STATUS.CART}</option>
                    <option value={STATUS.CONFIRMED}>{STATUS.CONFIRMED}</option>
                    <option value={STATUS.DELIVERED}>{STATUS.DELIVERED}</option>
                    <option value={STATUS.RECEIVED}>{STATUS.RECEIVED}</option>
                    <option value={STATUS.CANCELED}>{STATUS.CANCELED}</option>
                  </select>
                </td>

                <td style={{ minWidth: 180 }}>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={!canMarkReceived}
                    onClick={() => handleMarkReceived(order)}
                    title="Đổi trạng thái sang ĐÃ NHẬN"
                  >
                    Đánh dấu Đã nhận
                  </button>
                </td>

                <td style={{ minWidth: 120 }}>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      handleOrderStatusChange(order.id, statusDraft[order.id] ?? current)
                    }
                    disabled={isCanceled}
                  >
                    Lưu
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  const ProductsSection = () => (
    <>
      <h4 className="mt-2">🍽️ Quản lý sản phẩm</h4>
      <form className="row g-3 mb-4" onSubmit={handleDishSubmit}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Tên món"
            value={dishForm.name}
            onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
            required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Slug"
            value={dishForm.slug}
            onChange={(e) => setDishForm({ ...dishForm, slug: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" placeholder="Giá"
            value={dishForm.price}
            onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })} />
        </div>
        <div className="col-md-2">
          <select className="form-select"
            value={String(dishForm.is_featured)}
            onChange={(e) => setDishForm({ ...dishForm, is_featured: e.target.value === 'true' })}>
            <option value="false">Thường</option>
            <option value="true">Nổi bật</option>
          </select>
        </div>
        <div className="col-md-2">
          <input type="file" className="form-control" onChange={handleImageUpload} />
        </div>
        <div className="col-md-12">
          <textarea className="form-control" rows={2} placeholder="Mô tả"
            value={dishForm.description}
            onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" type="submit">
            {editingDishId ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Tên món</th>
            <th>Ảnh</th>
            <th>Slug</th>
            <th>Giá</th>
            <th>Nổi bật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.image ? <img src={d.image} width={50} height={40} alt={d.name} /> : 'N/A'}</td>
              <td>{d.slug}</td>
              <td>{(Number(d.price) || 0).toLocaleString('vi-VN')} đ</td>
              <td>{d.is_featured ? '✅' : ''}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleDishEdit(d)}>✏️</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDishDelete(d.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  // ====== RENDER ======
  if (loading) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  return (
    <div className={styles.adminLayout}>
      {/* SIDEBAR */}
      <aside className={styles.adminSidebar}>
        <div className={styles.adminUser}>
          <img src="/img/anhnen.jpg" alt="avatar" />
          <div className="name">Admin</div>
          <div className="status"><span className="dot" /> Online</div>
        </div>

        <nav className={styles.adminMenu}>
          <button className={`${styles.item} ${active === 'dashboard' ? styles.active : ''}`} onClick={() => setActive('dashboard')}>Trang chủ</button>
          <button className={`${styles.item} ${active === 'revenue' ? styles.active : ''}`} onClick={() => setActive('revenue')}>Doanh thu</button>
          <button className={`${styles.item} ${active === 'users' ? styles.active : ''}`} onClick={() => setActive('users')}>Quản lý người dùng</button>
          <button className={`${styles.item} ${active === 'orders' ? styles.active : ''}`} onClick={() => setActive('orders')}>Quản lý đơn hàng</button>
          <button className={`${styles.item} ${active === 'products' ? styles.active : ''}`} onClick={() => setActive('products')}>Quản lý sản phẩm</button>
          {/* Nút quay lại trang chủ */}
          <div className={styles.menuFooter}>
            <a href="/" className={`${styles.item} ${styles.backBtn}`}>
              ← Quay lại trang chủ
            </a>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <div className={styles.adminMain}>
        {/* TOPBAR */}
        <header className={styles.adminTopbar}>
          <button className={styles.hamburger} aria-label="menu">☰</button>
          <div className={styles.topTitle}>{TitleMap[active]}</div>
          <div className={styles.topActions}>
            <a className={styles.link} href="/" rel="noreferrer">Xem website</a>
            <div className={styles.avatarSm}><img src="/img/anhnen.jpg" alt="admin" /></div>
          </div>
        </header>

        {/* CONTENT */}
        <div className={styles.adminContent}>
          <div className="container mt-1 p-0">
            {active === 'dashboard' && <DashboardSection />}
            {active === 'revenue' && <RevenueSection />}
            {active === 'users' && <UsersSection />}
            {active === 'orders' && <OrdersSection />}
            {active === 'products' && <ProductsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
