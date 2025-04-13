import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Pagination,
  Card,
  Row,
  Col,
  Table,
  Space,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const BookPOS = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [note, setNote] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [promotion, setPromotion] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const pageSize = 18;
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/book", { headers });
      setAllProducts(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách sản phẩm");
    }
  };

  const validateVietnamPhone = (phone) => /^0[35789]\d{8}$/.test(phone);

  const handleCheckCustomer = async () => {
    if (!validateVietnamPhone(phone)) {
      message.warning("Số điện thoại không hợp lệ. Sẽ xử lý như khách lẻ.");
      setCustomerName("Khách lẻ");
      setIsExistingCustomer(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3001/api/customer/phone/${phone}`,
        { headers }
      );
      const customer = res.data;
      setCustomerName(customer.name);
      setIsExistingCustomer(true);
      message.success("Đã tìm thấy khách hàng");
    } catch {
      setCustomerName("");
      setIsExistingCustomer(false);
      message.info("Không tìm thấy khách hàng. Vui lòng nhập tên để tạo mới.");
    }
  };

  const addToCart = (product) => {
    const existing = selectedItems.find((item) => item._id === product._id);
    if (existing) {
      if (existing.quantity + 1 > product.quantity) {
        return message.warning("Vượt quá số lượng tồn kho");
      }
      const updated = selectedItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setSelectedItems(updated);
    } else {
      if (product.quantity < 1) {
        return message.warning("Sản phẩm đã hết hàng");
      }
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item._id !== id));
    message.success("Đã xóa sản phẩm khỏi đơn hàng");
  };

  const handleCheckPromotion = async () => {
    if (!promotionCode.trim()) {
      return message.warning("Vui lòng nhập mã khuyến mãi");
    }

    try {
      const res = await axios.get(
        `http://localhost:3001/api/promotion/find/by-code?code=${promotionCode.trim()}`,
        { headers }
      );
      const promo = res.data;
      const now = new Date();

      if (promo.status !== "active") return message.error("Mã khuyến mãi không còn hoạt động");
      if (new Date(promo.expiryDate) < now) return message.error("Mã khuyến mãi đã hết hạn");
      if (promo.quantity <= 0) return message.error("Mã khuyến mãi đã hết lượt sử dụng");
      if (totalAmount < promo.minOrderValue)
        return message.error(`Đơn hàng phải từ ${promo.minOrderValue.toLocaleString()} ₫ để áp dụng`);

      let discount = promo.type === "percentage"
        ? (promo.value / 100) * totalAmount
        : promo.value;

      setPromotion(promo);
      setDiscountAmount(discount);
      message.success("Áp dụng mã khuyến mãi thành công!");
    } catch {
      message.error("Không tìm thấy mã khuyến mãi");
      setPromotion(null);
      setDiscountAmount(0);
    }
  };

  const handleCheckout = async () => {
    if (!selectedItems.length) return message.error("Đơn hàng trống!");

    const isValidPhone = validateVietnamPhone(phone);
    if (isValidPhone && !customerName.trim()) return message.error("Vui lòng nhập tên khách hàng");

    const payload = {
      customerName: isValidPhone ? customerName : "Khách lẻ",
      customerPhone: isValidPhone ? phone : "0000000000",
      note,
      totalAmount: totalAmount - discountAmount,
      items: selectedItems.map((item) => ({
        product: item._id,
        title: item.title,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await axios.post("http://localhost:3001/api/order", payload, { headers });

      await Promise.all(
        selectedItems.map((item) =>
          axios.put(
            `http://localhost:3001/api/book/${item._id}/decrease`,
            { quantity: item.quantity },
            { headers }
          )
        )
      );

      message.success("Thanh toán thành công!");
      setSelectedItems([]);
      setPhone("");
      setCustomerName("");
      setIsExistingCustomer(false);
      setNote("");
      setPromotionCode("");
      setPromotion(null);
      setDiscountAmount(0);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error("Đã xảy ra lỗi khi thanh toán");
    }
  };

  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "",
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm khỏi đơn hàng?"
          onConfirm={() => removeItem(record._id)}
        >
          <DeleteOutlined style={{ color: "red" }} />
        </Popconfirm>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (text) => `${text.toLocaleString()} ₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tổng tiền",
      render: (_, record) =>
        `${(record.price * record.quantity).toLocaleString()} ₫`,
    },
  ];

  const totalQuantity = selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const totalAmount = selectedItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <h3>Đơn hàng</h3>
        <Table
          columns={columns}
          dataSource={selectedItems}
          pagination={false}
          rowKey="_id"
          size="small"
        />
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Input
              placeholder="Nhập mã khuyến mãi"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
            />
            <Button onClick={handleCheckPromotion}>Áp dụng</Button>
          </div>
          {promotion && (
            <div style={{ color: "green", marginBottom: 8 }}>
              Mã giảm: {promotion.code} ({promotion.type === "percentage" ? `${promotion.value}%` : `${promotion.value.toLocaleString()} ₫`})<br />
              Đã giảm: <b>{discountAmount.toLocaleString()} ₫</b>
            </div>
          )}
          <Input.TextArea
            placeholder="Ghi chú đơn hàng..."
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div style={{ marginTop: 8, fontWeight: "bold" }}>
            Tổng sản phẩm: {totalQuantity} | Tổng tiền hàng:{" "}
            {totalAmount.toLocaleString()} ₫ <br />
            Giảm giá: -{discountAmount.toLocaleString()} ₫ <br />
            <span style={{ color: "blue" }}>
              Tổng thanh toán: {(totalAmount - discountAmount).toLocaleString()} ₫
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1.2 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Input
            placeholder="SĐT khách hàng"
            prefix={<PhoneOutlined />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Tên khách hàng"
            prefix={<UserOutlined />}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isExistingCustomer}
          />
          <Button type="default" onClick={handleCheckCustomer}>
            Kiểm tra
          </Button>
        </div>
        <Input
          placeholder="Tìm sách..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Row gutter={[8, 8]}>
          {pagedProducts.map((product) => (
            <Col span={8} key={product._id}>
              <Card
                hoverable
                cover={<img alt={product.title} src={product.image} />}
                onClick={() => addToCart(product)}
              >
                <Card.Meta
                  title={product.title}
                  description={`${product.price.toLocaleString()} ₫`}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Pagination
          current={currentPage}
          total={filteredProducts.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: 16, textAlign: "center" }}
        />

        <Button
          type="primary"
          block
          style={{ marginTop: 16 }}
          onClick={handleCheckout}
        >
          THANH TOÁN
        </Button>
      </div>
    </div>
  );
};

export default BookPOS;
