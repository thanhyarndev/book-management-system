import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined,
} from "@ant-design/icons";

const Books = () => {
  const [form] = Form.useForm();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Mock Data
  useEffect(() => {
    const mockBooks = [
      {
        id: 1,
        title: "Dế Mèn Phiêu Lưu Ký",
        author: "Tô Hoài",
        category: "Tiểu thuyết",
        price: 50000,
        quantity: 20,
      },
      {
        id: 2,
        title: "Lập Trình Python Cơ Bản",
        author: "Nguyễn Văn Lập",
        category: "Giáo dục",
        price: 120000,
        quantity: 10,
      },
    ];
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  const showModal = (record = null) => {
    setEditingBook(record);
    form.setFieldsValue(record || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingBook(null);
  };

  const handleSave = (values) => {
    if (editingBook) {
      const updated = books.map((b) =>
        b.id === editingBook.id ? { ...b, ...values } : b
      );
      setBooks(updated);
      setFilteredBooks(updated);
      message.success("Cập nhật sách thành công!");
    } else {
      const newBook = {
        id: Date.now(),
        ...values,
      };
      const updated = [...books, newBook];
      setBooks(updated);
      setFilteredBooks(updated);
      message.success("Thêm sách mới thành công!");
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    setFilteredBooks(updated);
    message.success("Xóa sách thành công!");
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = books.filter(
      (b) =>
        b.title.toLowerCase().includes(text) ||
        b.author.toLowerCase().includes(text)
    );
    setFilteredBooks(filtered);
  };

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá (₫)",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()} ₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="link"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sách này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Tìm kiếm theo tên hoặc tác giả..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm sách
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBooks}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingBook ? "Cập nhật sách" : "Thêm sách"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingBook ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="title"
            label="Tên sách"
            rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Thể loại">
            <Input placeholder="Ví dụ: Tiểu thuyết, Khoa học..." />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (₫)"
            rules={[{ required: true, message: "Vui lòng nhập giá sách" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Books;
