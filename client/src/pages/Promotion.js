import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Popconfirm,
  message,
  DatePicker,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const Promotion = () => {
  const [form] = Form.useForm();
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        code: "SALE10",
        description: "Giảm 10% cho đơn trên 200K",
        type: "percent",
        value: 10,
        expiry: "2025-12-31",
      },
      {
        id: 2,
        code: "FREESHIP",
        description: "Giảm 20.000 cho đơn từ 300K",
        type: "amount",
        value: 20000,
        expiry: "2025-06-30",
      },
    ];
    setPromotions(mockData);
    setFilteredPromotions(mockData);
  }, []);

  const showModal = (record = null) => {
    setEditingPromo(record);
    form.setFieldsValue({
      ...record,
      expiry: record ? dayjs(record.expiry) : null,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingPromo(null);
    setIsModalVisible(false);
  };

  const handleSave = (values) => {
    const newData = {
      ...values,
      id: editingPromo ? editingPromo.id : Date.now(),
      expiry: values.expiry.format("YYYY-MM-DD"),
    };
    const updated = editingPromo
      ? promotions.map((promo) =>
          promo.id === editingPromo.id ? newData : promo
        )
      : [...promotions, newData];
    setPromotions(updated);
    setFilteredPromotions(updated);
    message.success(
      editingPromo ? "Cập nhật thành công" : "Thêm mã giảm giá thành công"
    );
    handleCancel();
  };

  const handleDelete = (id) => {
    const updated = promotions.filter((p) => p.id !== id);
    setPromotions(updated);
    setFilteredPromotions(updated);
    message.success("Đã xóa mã giảm giá");
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = promotions.filter(
      (p) =>
        p.code.toLowerCase().includes(text) ||
        p.description.toLowerCase().includes(text)
    );
    setFilteredPromotions(filtered);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type) => (type === "percent" ? "%" : "₫"),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      render: (text, record) =>
        record.type === "percent" ? `${text}%` : `${text.toLocaleString()} ₫`,
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="link"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa mã này?"
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
          placeholder="Tìm kiếm mã giảm giá..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm mã
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPromotions}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingPromo ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingPromo ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="code"
            label="Mã giảm giá"
            rules={[{ required: true, message: "Nhập mã" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại giảm giá"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="percent">Phần trăm</Option>
              <Option value="amount">Số tiền</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="value"
            label="Giá trị"
            rules={[{ required: true, message: "Nhập giá trị" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="expiry"
            label="Hạn sử dụng"
            rules={[{ required: true, message: "Chọn ngày" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Promotion;
