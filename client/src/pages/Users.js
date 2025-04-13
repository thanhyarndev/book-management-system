import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
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

const { Option } = Select;

const Users = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = (record = null) => {
    setEditingUser(record);
    form.setFieldsValue(record || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      if (editingUser) {
        await axios.put(`http://localhost:3001/api/user/${editingUser._id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Cập nhật người dùng thành công!");
      } else {
        await axios.post("http://localhost:3001/api/user", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Thêm người dùng mới thành công!");
      }
      handleCancel();
      fetchUsers();
    } catch (err) {
      message.error("Lỗi khi lưu người dùng");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (err) {
      message.error("Không thể xóa người dùng");
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = users.filter(
      (u) =>
        u.email.toLowerCase().includes(text) ||
        u.firstName.toLowerCase().includes(text)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (role === "admin" ? "Quản trị" : "Nhân viên"),
    },
    {
      title: "Trạng thái",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (status) => (status === "active" ? "Hoạt động" : "Bị chặn"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa người dùng này?" onConfirm={() => handleDelete(record._id)}>
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
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm theo email hoặc tên"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm người dùng
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" pagination={{ pageSize: 5 }} />

      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingUser ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input type="email" disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="firstName"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select>
              <Option value="admin">Quản trị</Option>
              <Option value="employee">Nhân viên</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="accountStatus"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="block">Bị chặn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
