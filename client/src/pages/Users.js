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
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const Users = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Mock data
  const mockUsers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      role: "admin",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranb@gmail.com",
      role: "user",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      role: "user",
    },
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  const showModal = (record = null) => {
    setEditingUser(record);
    form.setFieldsValue(record || { name: "", email: "", role: "user" });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  const handleSave = (values) => {
    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...values } : u
      );
      setUsers(updated);
      setFilteredUsers(updated);
      message.success("Cập nhật người dùng thành công!");
    } else {
      const newUser = {
        id: Date.now(),
        ...values,
      };
      const updated = [...users, newUser];
      setUsers(updated);
      setFilteredUsers(updated);
      message.success("Thêm người dùng mới thành công!");
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    setFilteredUsers(updated);
    message.success("Xóa người dùng thành công!");
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
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
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger type="link">
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
          placeholder="Tìm kiếm theo tên hoặc email..."
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
          Thêm người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingUser ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Input placeholder="admin hoặc user" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
