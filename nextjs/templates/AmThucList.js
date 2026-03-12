import Image from 'next/image';
import styles from '../styles/amthuc.module.css';

const amThucData = [
    {
        title: 'Ẩm thực chay',
        description: `Ẩm thực chay của Huế không chỉ là thói quen ăn uống mà còn là nét đẹp văn hóa gắn liền với đời sống tâm linh và tinh thần thanh tịnh. Các món chay ở Huế được chế biến cầu kỳ, khéo léo với nguyên liệu hoàn toàn từ rau củ, nấm, đậu phụ... nhưng vẫn giữ trọn hương vị hấp dẫn, thanh đạm và bổ dưỡng. Người Huế thường dồn tâm huyết để biến những nguyên liệu giản dị thành các món ăn vừa đẹp mắt, vừa ngon miệng, thể hiện triết lý sống hòa hợp với thiên nhiên.`,
        image: '/img/chitiet4.jpg',
    },
    {
        title: 'Ẩm thực cung đình',
        description: `Ẩm thực cung đình Huế là đỉnh cao của nghệ thuật chế biến và trình bày món ăn, vốn dành riêng cho vua chúa và hoàng tộc triều Nguyễn. Mỗi món ăn cung đình đều được chăm chút tỉ mỉ từ nguyên liệu, cách nêm nếm cho đến hình thức trang trí. Các món nổi tiếng như nem công, chả phượng, yến sào, hay những loại bánh trái nhỏ nhắn đều mang đậm phong cách tao nhã, sang trọng, phản ánh sự tinh tế trong văn hóa ẩm thực hoàng cung. Đây chính là tinh hoa để lại dấu ấn sâu sắc trong ẩm thực Việt Nam.`,
        image: '/img/monngon11.jpg',
    },
    {
        title: 'Bánh Trôi Huế',
        description: `Bánh trôi Huế là món bánh dân gian mang đậm hồn quê xứ Huế, thường được làm từ bột nếp dẻo thơm với nhân đậu xanh, mè hoặc dừa ngọt bùi. Những viên bánh tròn nhỏ được luộc chín, nổi lên mặt nước như những bông hoa trắng tinh khôi. Khi ăn, bánh mang lại cảm giác mềm mại, thơm mát và ngọt ngào. Đây là món ăn thường xuất hiện trong các dịp lễ hội, thể hiện sự tinh tế và giản dị nhưng đầy ý nghĩa trong đời sống thường ngày của người dân Huế.`,
        image: '/img/monanngon.jpg',
    },
    {
        title: 'Bún bò Huế',
        description: `Bún bò Huế là món ăn đặc sản trứ danh, gắn liền với tên tuổi và văn hóa ẩm thực của vùng đất cố đô. Nước dùng đậm đà được ninh từ xương bò, thêm chút mắm ruốc đặc trưng và vị cay nồng từ ớt sả. Tô bún bò Huế thường có thịt bò tái, giò heo, chả cua... hòa quyện trong sợi bún to, mềm nhưng dai. Khi thưởng thức, thực khách sẽ cảm nhận được sự hài hòa của vị ngọt tự nhiên, vị cay nồng đặc trưng và hương thơm quyến rũ, tạo nên sức hấp dẫn khó cưỡng.`,
        image: '/img/bunbohue.png',
    },
    {
        title: 'Mâm Đồ Cuốn',
        description: `Mâm đồ cuốn Huế là sự kết hợp phong phú của nhiều loại rau sống, bánh tráng, bún và các món nhân như thịt heo luộc, tôm, chả... Người ăn tự tay cuốn theo sở thích, tạo nên trải nghiệm vừa gần gũi, vừa thú vị. Rau thơm và các loại gia vị đặc trưng giúp món ăn thêm tươi mát, cân bằng vị béo của thịt cá. Mâm đồ cuốn không chỉ là món ăn ngon mà còn phản ánh lối sống thanh đạm, hòa hợp với thiên nhiên của người Huế.`,
        image: '/img/monngon7.jpg',
    },
    {
        title: 'Bánh Lọc Huế',
        description: `Bánh lọc Huế là món bánh truyền thống nổi tiếng, được gói trong lá chuối với lớp bột lọc trong suốt, dai mềm, ôm lấy phần nhân tôm thịt đậm đà. Khi bóc lớp lá ra, hương thơm của bột gạo, tôm rim, hành phi lan tỏa hấp dẫn. Món ăn này tuy bình dị nhưng lại thể hiện sự khéo léo, tinh tế trong từng công đoạn chế biến. Bánh lọc thường được chấm cùng nước mắm chua ngọt cay, tạo nên sự hòa quyện hương vị đặc trưng khó quên của ẩm thực Huế.`,
        image: '/img/monanngon1.jpg',
    }
];

export default function AmThucList() {
    return (
        <section className={styles.wrapper}>
            {/* ẢNH HEADER TRÊN CÙNG */}
            <div className={styles.fullWidthImageWrapper}>
                <Image
                    src="/img/mon1.jpg"
                    alt="Ẩm thực Huế"
                    layout="responsive"
                    width={1920}
                    height={500}
                    className={styles.fullWidthImage}
                    priority
                />
            </div>


            {/* DANH SÁCH 6 PHẦN ẨM THỰC */}
            {amThucData.map((item, index) => (
                <div
                    key={index}
                    className={`${styles.section} ${index % 2 !== 0 ? styles.reverse : ''}`}
                >
                    <div className={styles.imageContainer}>
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={500}
                            height={350}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.textContainer}>
                        <h2 className={styles.title}>{item.title}</h2>
                        <p className={styles.description}>{item.description}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}
