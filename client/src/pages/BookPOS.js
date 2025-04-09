// src/pages/BookPOS.js
import React, { useState } from "react";
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
  Form,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
// import "./BookPOS.css";

const allProductsMock = [
  {
    id: 1,
    sku: "BOOK001",
    title: "Đắc Nhân Tâm",
    price: 89000,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    sku: "BOOK002",
    title: "7 Thói Quen Hiệu Quả",
    price: 109000,
    image: "https://via.placeholder.com/100",
  },
];

const BookPOS = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  const pageSize = 18;
  const filteredProducts = allProductsMock.filter((product) =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const addToCart = (product) => {
    const existing = selectedItems.find((item) => item.id === product.id);
    if (existing) {
      const updated = selectedItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setSelectedItems(updated);
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
    message.success("Đã xóa sản phẩm khỏi đơn hàng");
  };

  const handleCheckCustomer = () => {
    if (phone === "0123456789") {
      setCustomerName("Nguyễn Văn A");
      setIsExistingCustomer(true);
      message.success("Đã tìm thấy khách hàng");
    } else {
      setCustomerName("");
      setIsExistingCustomer(false);
      message.info("Không tìm thấy khách hàng. Vui lòng nhập tên để tạo mới.");
    }
  };

  const handleCheckout = () => {
    if (!phone) {
      message.error("Vui lòng nhập số điện thoại khách hàng");
      return;
    }
    if (!customerName) {
      message.error("Vui lòng nhập tên khách hàng để tạo mới");
      return;
    }
    if (!selectedItems.length) {
      message.error("Đơn hàng trống!");
      return;
    }
    if (!isExistingCustomer) {
      message.success("Tạo khách hàng mới thành công");
    }
    message.success("Thanh toán thành công!");
    setSelectedItems([]);
    setPhone("");
    setCustomerName("");
    setIsExistingCustomer(false);
  };

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
          onConfirm={() => removeItem(record.id)}
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
          rowKey="id"
          size="small"
        />
        <div style={{ marginTop: 16 }}>
          <Input.TextArea placeholder="Ghi chú đơn hàng..." rows={2} />
          <div style={{ marginTop: 8, fontWeight: "bold" }}>
            Tổng sản phẩm: {totalQuantity} | Tổng tiền hàng:{" "}
            {totalAmount.toLocaleString()} ₫
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
            <Col span={8} key={product.id}>
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
