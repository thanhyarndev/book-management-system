import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Popconfirm,
  message,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Books = () => {
  const [form] = Form.useForm();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/book");
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách sách");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/category");
      setCategories(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách thể loại");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const showModal = (record = null) => {
    setEditingBook(record);
    setImageBase64(record?.image || "");
    form.setFieldsValue({
      ...record,
      category: record?.category?._id || "",
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingBook(null);
    setImageBase64("");
  };

  const handleSave = async (values) => {
    const payload = { ...values, image: imageBase64 };

    try {
      if (editingBook) {
        await axios.put(`http://localhost:3001/api/book/${editingBook._id}`, payload);
        message.success("Cập nhật sách thành công!");
      } else {
        await axios.post("http://localhost:3001/api/book", payload);
        message.success("Thêm sách mới thành công!");
      }
      handleCancel();
      fetchBooks();
    } catch (err) {
      message.error("Lỗi khi lưu sách");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/book/${id}`);
      message.success("Xóa sách thành công!");
      fetchBooks();
    } catch (err) {
      message.error("Không thể xóa sách");
    }
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => img && <img src={img} alt="book" width="40" height="60" />,
    },
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
      dataIndex: ["category", "name"],
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
            onConfirm={() => handleDelete(record._id)}
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
        rowKey="_id"
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
            name="sku"
            label="Mã SKU"
            rules={[{ required: true, message: "Vui lòng nhập mã SKU" }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            name="category"
            label="Thể loại"
            rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
          >
            <Select placeholder="Chọn thể loại">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
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
          <Form.Item label="Ảnh sách">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {imageBase64 && (
              <img src={imageBase64} alt="Preview" style={{ marginTop: 8, width: 100 }} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Books;
