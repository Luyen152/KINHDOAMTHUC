-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 08, 2025 at 04:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kinhdoamthuc`
--

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image`, `link`, `position`, `sort_order`, `created_at`) VALUES
(1, 'BÁNH TRÁI CÂY', '1.jpg', '', 0, 1, '2025-05-30 15:02:44'),
(2, 'TRÀ SEN ƯỚP XÔI', '2.jpg', '', 0, 2, '2025-05-30 15:02:44'),
(3, 'XÔI VỚI TÔM CHÁY', 'mon3.jpg', '', 0, 3, '2025-06-04 09:48:17'),
(4, 'VẢ TRỘN', 'mon4.jpg', '', 0, 4, '2025-06-04 09:48:17'),
(5, 'Ẩm thực Huế trái', '4.jpg', NULL, 1, 1, '2025-06-04 11:11:11'),
(6, 'Ẩm thực Huế phải', '5.jpg', NULL, 1, 2, '2025-06-04 11:11:11'),
(7, 'MÓN ĂN HUẾ', '6.jpg', NULL, 2, 1, '2025-06-05 09:02:34');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`) VALUES
(1, 'Món ngon mỗi ngày', 'mon-ngon-moi-ngay', 'Cập nhật món ăn hàng ngày phù hợp mọi gia đình', '2025-05-30 15:02:44'),
(2, 'Ẩm thực vùng miền', 'am-thuc-vung-mien', 'Khám phá đặc sản ẩm thực từ Bắc vào Nam', '2025-05-30 15:02:44'),
(3, 'Kinh nghiệm bếp núc', 'kinh-nghiem-bep-nuc', 'Mẹo vặt, kỹ năng nấu ăn hay ho', '2025-05-30 15:02:44');

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_don_hang`
--

CREATE TABLE `chi_tiet_don_hang` (
  `id` int(11) NOT NULL,
  `id_don_hang` int(11) NOT NULL,
  `id_mon_an` int(11) NOT NULL,
  `ten_mon` varchar(255) DEFAULT NULL,
  `gia_ban` decimal(12,2) NOT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 1,
  `thanh_tien` decimal(12,2) GENERATED ALWAYS AS (`so_luong` * `gia_ban`) STORED,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `size` varchar(10) NOT NULL DEFAULT 'vừa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`id`, `id_don_hang`, `id_mon_an`, `ten_mon`, `gia_ban`, `so_luong`, `ghi_chu`, `created_at`, `updated_at`, `size`) VALUES
(1, 7, 1, NULL, 50000.00, 1, NULL, '2025-08-13 10:50:36', '2025-08-13 13:15:18', 'vừa'),
(2, 7, 2, NULL, 55000.00, 1, NULL, '2025-08-13 11:07:52', '2025-08-13 11:13:30', 'vừa'),
(3, 7, 3, NULL, 45000.00, 1, NULL, '2025-08-13 12:57:13', '2025-08-13 12:57:13', 'vừa'),
(4, 8, 1, NULL, 50000.00, 2, NULL, '2025-08-14 02:23:34', '2025-08-14 02:58:26', 'vừa'),
(6, 10, 2, NULL, 55000.00, 1, NULL, '2025-08-14 04:27:30', '2025-08-14 04:27:30', 'vừa'),
(7, 11, 1, NULL, 50000.00, 2, NULL, '2025-08-14 08:33:14', '2025-08-14 08:33:18', 'vừa'),
(8, 12, 3, NULL, 45000.00, 1, NULL, '2025-08-14 10:02:55', '2025-08-14 10:02:55', 'vừa'),
(9, 12, 4, NULL, 40000.00, 1, NULL, '2025-08-14 10:03:12', '2025-08-14 10:03:12', 'vừa'),
(10, 13, 1, NULL, 50000.00, 2, NULL, '2025-08-15 13:30:55', '2025-08-15 13:30:57', 'vừa'),
(11, 14, 1, NULL, 50000.00, 1, NULL, '2025-08-18 04:02:10', '2025-08-18 04:02:10', 'vừa'),
(12, 15, 2, NULL, 55000.00, 1, NULL, '2025-08-18 04:02:58', '2025-08-18 04:02:58', 'vừa'),
(13, 16, 1, NULL, 50000.00, 1, NULL, '2025-08-28 07:31:19', '2025-08-28 07:31:19', 'vừa'),
(14, 17, 2, NULL, 55000.00, 1, NULL, '2025-08-28 07:40:49', '2025-08-28 07:40:49', 'vừa'),
(15, 18, 4, NULL, 40000.00, 1, NULL, '2025-09-03 02:33:28', '2025-09-03 02:33:28', 'vừa'),
(16, 19, 2, NULL, 55000.00, 1, NULL, '2025-09-04 11:02:43', '2025-09-04 11:02:43', 'vừa'),
(17, 20, 4, NULL, 40000.00, 1, NULL, '2025-09-06 11:58:29', '2025-09-06 11:58:29', 'vừa'),
(18, 2, 2, NULL, 55000.00, 1, NULL, '2025-09-06 14:09:11', '2025-09-06 14:09:11', 'vừa'),
(19, 21, 6, NULL, 40000.00, 1, NULL, '2025-09-06 14:10:52', '2025-09-06 14:10:52', 'vừa'),
(20, 22, 11, NULL, 60000.00, 1, NULL, '2025-09-06 14:17:57', '2025-09-06 14:17:57', 'vừa'),
(22, 24, 1, NULL, 50000.00, 2, NULL, '2025-09-07 07:05:34', '2025-09-07 07:05:43', 'vừa'),
(23, 25, 2, NULL, 55000.00, 1, NULL, '2025-09-07 07:06:36', '2025-09-07 07:06:36', 'vừa');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `rating` enum('1','2','3','4','5') NOT NULL DEFAULT '5',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `dish_id`, `user_id`, `user_name`, `content`, `rating`, `created_at`) VALUES
(7, 1, 7, 'Luyen', 'Món này rất ngon!', '5', '2025-06-09 14:02:23'),
(9, 1, 7, 'Luyen', 'món này khá đẹp mắt', '3', '2025-06-10 09:24:10'),
(10, 1, 7, 'Luyen', 'Món này được chế biến như nào', '3', '2025-06-11 08:45:56'),
(21, 2, 7, 'Luyen', 'món này đẹp mắt quá', '4', '2025-06-11 09:46:34'),
(22, 1, 6, 'User One', 'món này ngon', '3', '2025-06-11 16:28:47'),
(23, 1, 6, 'User One', 'món này chế biến như nào', '4', '2025-06-11 16:29:32'),
(24, 1, 15, 'Admin', 'món này tôi nấu', '4', '2025-06-11 20:50:01'),
(25, 1, 15, 'Admin', 'Món này ai cần hướng dẫn không', '4', '2025-06-11 21:03:37'),
(26, 1, 15, 'Admin', 'hhh', '3', '2025-06-11 21:10:25'),
(27, 2, 6, 'User One', 'Món này ngon đấy', '3', '2025-06-11 21:33:31'),
(89, 3, 7, 'Luyen', 'toi ko thich mon nay', '3', '2025-07-30 08:24:13'),
(90, 3, 6, 'User One', 'Nhin mon nay kha hap dan', '4', '2025-07-30 08:27:53'),
(91, 4, 6, 'User One', 'Huong dan cach lam cho moi nguoi di', '4', '2025-07-30 08:28:56'),
(92, 1, 6, 'User One', 'Nhìn ngon quá', '4', '2025-08-13 17:20:02'),
(93, 1, 6, 'User One', 'món nà ngon', '3', '2025-09-04 17:54:36');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 'Trần Minh', 'tranminh@example.com', 'Share bài viết', 'Mình muốn đăng bài chia sẻ món ăn, liên hệ thế nào ạ?', '2025-05-30 15:02:44'),
(2, 'Phạm Hoa', 'phamhoa@example.com', 'Ẩm Thực', 'Web rất hữu ích, cảm ơn team Kinh Đô Ẩm Thực!', '2025-05-30 15:02:44'),
(3, 'Lưu Thị Lan', 'lulan@example.com', 'Fix login', 'Mình bị lỗi khi đăng nhập, nhờ admin hỗ trợ.', '2025-05-30 15:02:44'),
(4, 'Huyquanhoa', 'huy@gmail.com', 'Món Ăn ', 'Tôi Thích Những Món Ăn của bạn ', '2025-06-05 09:54:44'),
(5, 'Tue', 'Tue@gmail.com', 'Mon an', 'Món này ngon lắm ', '2025-06-05 10:33:09'),
(6, 'na', 'na@gmail.com', 'Mon an', 'Món này ngon', '2025-06-09 10:10:13'),
(7, 'Nguyễn Văn Luyện', 'luyen0932498215@gmail.com', 'Món Ăn ', 'Các món ăn này cần thêm hướng dẫn nấu chi tiết', '2025-09-07 14:09:36');

-- --------------------------------------------------------

--
-- Table structure for table `dishes`
--

CREATE TABLE `dishes` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `difficulty` tinyint(4) DEFAULT 1,
  `servings` int(11) DEFAULT NULL,
  `is_featured` bit(1) DEFAULT b'0',
  `created_at` datetime DEFAULT current_timestamp(),
  `gia` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dishes`
--

INSERT INTO `dishes` (`id`, `name`, `slug`, `description`, `image`, `category_id`, `region`, `difficulty`, `servings`, `is_featured`, `created_at`, `gia`) VALUES
(1, 'Vịt Hon Kiểu Huế', 'vit-hon-kieu-hue', 'Món vịt hon đặc trưng xứ Huế với nước dùng đậm đà, thịt hon với nhiều nguyên liệu bổ dưỡng', 'monngon8.jpg', 2, 'Trung', 4, 4, b'1', '2025-06-05 09:17:35', 50000.00),
(2, 'Cơm Hấp Lá Sen', 'com-hap-la-sen', 'Món cơm hấp với lá sen thơm ngon, và sánh dẻo của các hạt cơm hòa quyện với hương vị đặc trưng của lá sen', 'monngon9.jpg', 2, 'Trung', 3, 3, b'1', '2025-06-05 09:17:35', 55000.00),
(3, 'Chạo Tôm Lụi Mía', 'chao-tom-lui-mia', 'Chạo tôm lụi mía là 1 món ăn độc lạ được kết hợp giữa tôm và mía, khiến cho tôm giữ được vị ngọt và chắc thịt', 'monngon10.jpg', 2, 'Trung', 3, 2, b'1', '2025-06-05 09:17:35', 45000.00),
(4, 'Cá Hấp Ngũ Liễu', 'ca-hap-ngu-lieu', 'Món cá hấp này khiến cho cá giữ được hương vị tươi ngon và có thể sử dụng trong các bữa tiệc', 'monngon11.jpg', 3, 'Trung', 2, 4, b'1', '2025-06-05 09:17:35', 40000.00),
(5, 'Bánh Sâm', 'banh-sam', 'Món bánh sâm thường được sử dụng như 1 món tráng miệng giúp cho người dùng thanh lọc và làm mát gan bổ thận', 'monngon12.jpg', 2, 'Trung', 3, 2, b'1', '2025-06-05 09:17:35', 45000.00),
(6, 'Bánh Bèo Huế', 'banh-beo-hue', 'Bánh bèo chén mềm, thơm, ăn kèm tôm chấy và mỡ hành.', 'monngon13.jpg', 2, 'Trung', 2, 3, b'1', '2025-06-05 09:17:35', 40000.00),
(7, 'Bánh Nậm', 'banh-nam', 'Bánh gói lá dong nhân tôm thịt hấp mềm thơm đặc sản Huế.', 'monngon14.jpg', 2, 'Trung', 2, 3, b'1', '2025-06-05 09:17:35', 40000.00),
(8, 'Bánh Lọc', 'banh-loc', 'Bánh lọc trong suốt nhân tôm thịt ăn dai ngon nổi tiếng.', 'monngon15.jpg', 2, 'Trung', 3, 2, b'1', '2025-06-05 09:17:35', 45000.00),
(9, 'Bánh Khoái', 'banh-khoai', 'Món bánh chiên giòn nhân tôm thịt và giá đỗ, chấm nước lèo.', 'monngon16.jpg', 2, 'Trung', 3, 3, b'1', '2025-06-05 09:17:35', 55000.00),
(10, 'Chè Hẻm Huế', 'che-hem-hue', 'Các loại chè thập cẩm, chè bắp, chè đậu ngọt mát xứ Huế.', 'monngon17.jpg', 2, 'Trung', 2, 2, b'1', '2025-06-05 09:17:35', 35000.00),
(11, 'Nem Lụi Huế', 'nem-lui-hue', 'Nem thịt nướng xiên que ăn kèm bánh tráng và rau sống.', 'monngon18.jpg', 2, 'Trung', 3, 3, b'1', '2025-06-05 09:17:35', 60000.00),
(12, 'Cơm Âm Phủ', 'com-am-phu', 'Cơm trộn nhiều loại topping thịt, chả, trứng đặc biệt Huế.', 'monngon19.jpg', 2, 'Trung', 3, 4, b'1', '2025-06-05 09:17:35', 55000.00),
(13, 'Bún Thịt Nướng Huế', 'bun-thit-nuong-hue', 'Bún ăn kèm thịt nướng, chả giò, rau sống và mắm nêm.', 'monngon20.jpg', 2, 'Trung', 2, 3, b'1', '2025-06-05 09:17:35', 50000.00),
(14, 'Bún Hến', 'bun-hen', 'Bún nhỏ ăn kèm hến xào, rau thơm và nước mắm cay xứ Huế.', 'monngon21.jpg', 2, 'Trung', 3, 2, b'1', '2025-06-05 09:17:35', 45000.00),
(15, 'Mè Xửng Huế', 'me-xung-hue', 'Kẹo mè xửng dẻo ngọt, thơm bùi mè rang đặc sản Huế.', 'monngon22.jpg', 2, 'Trung', 2, 4, b'1', '2025-06-05 09:17:35', 40000.00),
(16, 'Chả Huế', 'cha-hue', 'Chả lụa, chả bò, chả cua Huế đặc trưng, hương vị đậm đà.', 'monngon23.jpg', 2, 'Trung', 3, 3, b'1', '2025-06-05 09:17:35', 50000.00),
(17, 'Bánh Ướt Thịt Nướng', 'banh-uot-thit-nuong', 'Bánh ướt mềm ăn kèm thịt nướng, rau thơm và nước chấm.', 'monngon24.jpg', 2, 'Trung', 2, 3, b'1', '2025-06-05 09:17:35', 50000.00),
(18, 'Bánh Ram Ít', 'banh-ram-it', 'Bánh ít dẻo đặt trên ram giòn chấm nước mắm ngon.', 'monngon25.jpg', 2, 'Trung', 3, 2, b'1', '2025-06-05 09:17:35', 45000.00),
(19, 'Bánh Canh Cá Lóc Huế', 'banh-canh-ca-loc-hue', 'Bánh canh sợi to ăn cùng cá lóc nấu đậm đà Huế.', 'monngon26.jpg', 2, 'Trung', 3, 3, b'1', '2025-06-05 09:17:35', 55000.00),
(20, 'Gỏi Gà Huế', 'goi-ga-hue', 'Gỏi gà trộn rau răm, hành tây và gia vị cay chua ngọt.', 'monngon27.jpg', 2, 'Trung', 2, 4, b'1', '2025-06-05 09:17:35', 60000.00);

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

CREATE TABLE `don_hang` (
  `id` int(11) NOT NULL,
  `id_nguoi_dung` int(11) DEFAULT NULL,
  `ngay_dat` datetime DEFAULT NULL,
  `tong_tien` decimal(10,2) DEFAULT 0.00,
  `trang_thai` varchar(50) DEFAULT 'Đang xử lý',
  `ho_ten` varchar(100) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `tinh_thanh` varchar(64) DEFAULT NULL,
  `quan_huyen` varchar(64) DEFAULT NULL,
  `phuong_xa` varchar(64) DEFAULT NULL,
  `so_nha` varchar(64) DEFAULT NULL,
  `dia_chi_day_du` varchar(255) DEFAULT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `thoi_gian_nhan` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `don_hang`
--

INSERT INTO `don_hang` (`id`, `id_nguoi_dung`, `ngay_dat`, `tong_tien`, `trang_thai`, `ho_ten`, `so_dien_thoai`, `tinh_thanh`, `quan_huyen`, `phuong_xa`, `so_nha`, `dia_chi_day_du`, `ghi_chu`, `updated_at`, `thoi_gian_nhan`) VALUES
(2, 7, '2025-09-06 21:10:20', 55000.00, 'Đã xác nhận', 'Nguyễn Văn Luyện', '0932498215', 'Thừa Thiên Huế', 'Thành phố Huế', 'Hương Long', 'Thôn Định Môn', 'Thôn Định Môn, Hương Long, Thành phố Huế, Thừa Thiên Huế', NULL, '2025-09-06 21:10:20', NULL),
(3, 6, '2025-07-29 13:01:05', 55000.00, 'Đã thanh toán', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-03 11:11:31', NULL),
(4, 6, '2025-07-29 13:03:19', 55000.00, 'Đã thanh toán', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-03 11:11:31', NULL),
(7, 6, '2025-08-13 20:16:11', 150000.00, 'Đã xác nhận', 'Nguyễn Văn Luyện', '0965466068', 'Thừa Thiên Huế', 'Thành phố Huế', 'Phú Nhuận', '12 Nguyễn Huệ', '12 Nguyễn Huệ, Phú Nhuận, Thành phố Huế, Thừa Thiên Huế', 'Gọi trước 15p', '2025-09-03 11:11:31', NULL),
(8, 6, '2025-08-14 10:15:56', 100000.00, 'Đã xác nhận', 'Nguyễn Văn Luyện', '0965466068', 'Thừa Thiên Huế', 'Thành phố Huế', 'Phú Nhuận', '12 Nguyễn Huệ', '12 Nguyễn Huệ, Phú Nhuận, Thành phố Huế, Thừa Thiên Huế', NULL, '2025-09-03 11:11:31', NULL),
(10, 6, '2025-08-14 11:32:40', 55000.00, 'Đã xác nhận', NULL, '0932498215', 'Thừa Thiên Huế', 'Thành phố Huế', 'Phú Nhuận', '12 Nguyễn Huệ', '12 Nguyễn Huệ, Phú Nhuận, Thành phố Huế, Thừa Thiên Huế', NULL, '2025-09-03 11:11:31', NULL),
(11, 6, '2025-08-14 15:40:43', 100000.00, 'Đã xác nhận', 'Nguyễn Văn Luyện', '+84988282857', 'Thừa Thiên Huế', 'Thành phố Huế', 'Xuân Phú', '12 Nguyễn Huệ', '12 Nguyễn Huệ, Xuân Phú, Thành phố Huế, Thừa Thiên Huế', NULL, '2025-09-03 11:11:31', NULL),
(12, 6, '2025-08-15 11:25:30', 85000.00, 'Đã hủy', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:11:31', NULL),
(13, 6, '2025-08-15 20:39:28', 100000.00, 'Đã xác nhận', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:11:31', NULL),
(14, 6, '2025-08-18 11:02:26', 50000.00, 'Đã hủy', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:11:31', NULL),
(15, 6, '2025-08-28 14:29:59', 55000.00, 'Đã hủy', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:11:31', NULL),
(16, 6, '2025-08-28 14:31:23', 50000.00, 'Đã hủy', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:11:31', NULL),
(17, 6, '2025-08-28 14:40:53', 55000.00, 'Đã hủy', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:11:31', NULL),
(18, 6, '2025-09-03 09:33:43', 40000.00, 'Đã nhận', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-03 11:12:49', '2025-09-03 11:12:49'),
(19, 6, '2025-09-04 18:02:51', 55000.00, 'Đã xác nhận', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-04 18:02:51', NULL),
(20, 6, '2025-09-06 21:17:24', 40000.00, 'Đã xác nhận', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-06 21:17:24', NULL),
(21, 7, '2025-09-06 21:12:10', 40000.00, 'Đã hủy', 'Nguyễn Văn Luyện', '0932498215', 'Thừa Thiên Huế', 'Thành phố Huế', 'Hương Long', 'Thôn Định Môn', 'Thôn Định Môn, Hương Long, Thành phố Huế, Thừa Thiên Huế', NULL, '2025-09-06 21:12:24', NULL),
(22, 7, '2025-09-06 21:18:03', 60000.00, 'Đã xác nhận', 'Nguyễn Văn Luyện', '0932498215', 'Thừa Thiên Huế', 'Thành phố Huế', 'Hương Long', 'Thôn Định Môn', 'Thôn Định Môn, Hương Long, Thành phố Huế, Thừa Thiên Huế', NULL, '2025-09-06 21:18:03', NULL),
(24, 6, '2025-09-07 14:06:12', 100000.00, 'Đã hủy', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', 'gọi trước 5p', '2025-09-07 14:06:29', NULL),
(25, 6, '2025-09-07 14:06:42', 55000.00, 'Đã nhận', 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', NULL, '2025-09-07 14:06:50', '2025-09-07 14:06:50');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `title`, `url`, `category_id`, `position`, `sort_order`, `created_at`) VALUES
(1, 'Trang chủ', '/', NULL, 1, 1, '2025-06-11 15:16:06'),
(2, 'Kinh đô ẩm thực', '/kinhdo', NULL, 1, 2, '2025-06-11 15:16:06'),
(3, 'Món ăn Huế', '/amthuclist', NULL, 1, 3, '2025-06-11 15:16:06'),
(4, 'Tin tức', '/tintuc', NULL, 1, 4, '2025-06-11 15:16:06'),
(6, 'Liên hệ', '/contact', NULL, 1, 6, '2025-06-11 15:16:06'),
(7, 'Giỏ hàng', '/gio-hang', NULL, 1, 7, '2025-07-02 10:46:59'),
(8, 'Tìm kiếm', '/tim-kiem', NULL, 1, 8, '2025-07-02 10:47:26');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `summary`, `content`, `image`, `author`, `user_id`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Cách làm bún chả Hà Nội chuẩn vị', 'bun-cha-ha-noi', 'Hướng dẫn làm bún chả đúng vị Hà Nội', 'Nội dung chi tiết về cách làm bún chả...', 'buncha.jpg', 'Nguyễn Văn A', NULL, 2, '2025-05-30 15:02:44', NULL),
(2, 'Mẹo chiên cá không bị vỡ nát', 'meo-chien-ca-khong-vo', 'Chia sẻ bí quyết chiên cá vàng giòn', 'Nội dung chi tiết về cách chiên cá...', 'chienca.jpg', 'Lê Thị B', NULL, 3, '2025-05-30 15:02:44', NULL),
(3, 'Cơm gà Hội An – Đặc sản miền Trung', 'com-ga-hoi-an', 'Món ngon nổi tiếng xứ Quảng', 'Nội dung chi tiết về cơm gà Hội An...', 'comga.jpg', 'Admin', NULL, 2, '2025-05-30 15:02:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `role`, `created_at`) VALUES
(6, 'User One', 'user1@gmail.com', '$2b$10$hCJDpUyEw46/5gsbHp/kNuBbST5Blq9qJuLC0MAL3li7F1cRfyhvW', 'images/user1.jpg', 1, '2025-06-09 11:36:15'),
(7, 'Luyen', 'Luyen@gmail.com', '$2b$10$5glLE/Ut1r1jkj9GQQB34OoyqcTC58FWbunrtyMitUMfDgxisZuX.', 'images/default-avatar.jpg', 0, '2025-06-09 12:16:05'),
(15, 'Admin', 'admin@example.com', '$2b$10$HMrE.psuMbNgz2gBZmcEn.F4oAPxmaHVSbNgDUOCjcNMu2Ml.PJrW', 'images/default-avatar.jpg', 1, '2025-06-10 11:17:23'),
(18, 'HoaNguyen', 'hoahoa@gmail.com', '$2b$10$aECoS6YU9RbgMSrOUvxS.eqLDIUr5kn2MrRwVVgu9Ef/MzGbxJQCu', 'images/default-avatar.jpg', 0, '2025-09-06 22:35:10');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL DEFAULT '',
  `so_dien_thoai` varchar(32) NOT NULL DEFAULT '',
  `tinh_thanh` varchar(255) NOT NULL DEFAULT '',
  `quan_huyen` varchar(255) NOT NULL DEFAULT '',
  `phuong_xa` varchar(255) NOT NULL DEFAULT '',
  `so_nha` varchar(255) NOT NULL DEFAULT '',
  `dia_chi_day_du` varchar(512) NOT NULL DEFAULT '',
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `ho_ten`, `so_dien_thoai`, `tinh_thanh`, `quan_huyen`, `phuong_xa`, `so_nha`, `dia_chi_day_du`, `updated_at`) VALUES
(1, 6, 'Nguyễn Văn An', '0965466068', 'Thành Phố Huế', 'Hương Thủy', 'Xã Hương Thọ', 'Sân Banh định môn', 'Sân Banh định môn, Xã Hương Thọ, Hương Thủy, Thành Phố Huế', '2025-08-28 14:29:48'),
(3, 7, 'Nguyễn Văn Luyện', '0932498215', 'Thừa Thiên Huế', 'Thành phố Huế', 'Hương Long', 'Thôn Định Môn', 'Thôn Định Môn, Xã Hương Thọ, Thành phố Huế, Thừa Thiên Huế', '2025-09-06 21:13:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categories_slug` (`slug`);

--
-- Indexes for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_don_mon` (`id_don_hang`,`id_mon_an`),
  ADD UNIQUE KEY `uniq_don_mon_size` (`id_don_hang`,`id_mon_an`,`size`),
  ADD KEY `idx_ctdh_donhang` (`id_don_hang`),
  ADD KEY `idx_ctdh_mon` (`id_mon_an`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_post` (`dish_id`),
  ADD KEY `fk_comments_user` (`user_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_don_hang_user` (`id_nguoi_dung`),
  ADD KEY `idx_don_hang_status` (`trang_thai`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_menus_category` (`category_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_posts_slug` (`slug`),
  ADD KEY `fk_posts_user` (`user_id`),
  ADD KEY `fk_posts_category` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_addresses_user` (`user_id`),
  ADD KEY `idx_user_addresses_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dishes`
--
ALTER TABLE `dishes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `fk_ctdh_donhang` FOREIGN KEY (`id_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctdh_mon` FOREIGN KEY (`id_mon_an`) REFERENCES `dishes` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_dish` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `dishes_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `fk_menus_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `fk_user_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
