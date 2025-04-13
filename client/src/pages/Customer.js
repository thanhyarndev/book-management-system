import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Input, Button, Modal, Form, Space, message } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";

const Customer = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      message.error("Lỗi tải danh sách khách hàng");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(value) ||
        customer.phonenumber?.includes(value)
    );
    setFilteredCustomers(filtered);
  };

  const showEditModal = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({ name: customer.name });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCustomer(null);
  };

  const handleSave = async (values) => {
    try {
      await axios.put(
        `http://localhost:3001/api/customer/${editingCustomer._id}`,
        {
          ...editingCustomer,
          name: values.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật tên khách hàng thành công");
      handleCancel();
      fetchCustomers();
    } catch (err) {
      message.error("Lỗi khi cập nhật khách hàng");
    }
  };

  const columns = [
    {
      title: "SĐT",
      dataIndex: "phonenumber",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      render: (value) =>
        typeof value === "number" ? `${value.toLocaleString()} ₫` : "0 ₫",
    },
    {
      title: "Số lần mua",
      dataIndex: "visitCount",
      render: (value) => value || 0,
    },
    {
      title: "Cấp độ",
      dataIndex: "loyaltyLevel",
      render: (value) => value || "-",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Đổi tên
          </Button>
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
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Cập nhật tên khách hàng"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Lưu"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Tên khách hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customer;
