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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Categories = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/category");
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách thể loại");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showModal = (record = null) => {
    setEditingCategory(record);
    form.setFieldsValue(record || { name: "" });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleSave = async (values) => {
    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:3001/api/category/${editingCategory._id}`,
          values
        );
        message.success("Cập nhật thể loại thành công!");
      } else {
        await axios.post("http://localhost:3001/api/category", values);
        message.success("Thêm thể loại mới thành công!");
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      message.error("Lỗi khi lưu thể loại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/category/${id}`);
      message.success("Xóa thể loại thành công!");
      fetchCategories();
    } catch (err) {
      message.error("Không thể xóa thể loại");
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(text)
    );
    setFilteredCategories(filtered);
  };

  const columns = [
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thể loại này?"
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
          placeholder="Tìm kiếm thể loại..."
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
          Thêm thể loại
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingCategory ? "Cập nhật thể loại" : "Thêm thể loại"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingCategory ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Tên thể loại"
            rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
