import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
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
import dayjs from "dayjs";

const { Option } = Select;

const Promotion = () => {
  const [form] = Form.useForm();
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("token");

  const fetchPromotions = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/promotion", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions(res.data);
      setFilteredPromotions(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách khuyến mãi");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const showModal = (record = null) => {
    setEditingPromotion(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        expiryDate: dayjs(record.expiryDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPromotion(null);
    form.resetFields();
  };

  const handleSave = async (values) => {
    const payload = {
      ...values,
      expiryDate: values.expiryDate.toISOString(),
    };

    try {
      if (editingPromotion) {
        await axios.put(
          `http://localhost:3001/api/promotion/${editingPromotion._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Cập nhật khuyến mãi thành công!");
      } else {
        await axios.post("http://localhost:3001/api/promotion", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Thêm khuyến mãi mới thành công!");
      }
      handleCancel();
      fetchPromotions();
    } catch (err) {
      message.error("Lỗi khi lưu khuyến mãi");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/promotion/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Xóa khuyến mãi thành công!");
      fetchPromotions();
    } catch (err) {
      message.error("Không thể xóa khuyến mãi");
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtered = promotions.filter((p) =>
      p.code.toLowerCase().includes(text)
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
      render: (type) => (type === "percentage" ? "%" : "VNĐ"),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
    },
    {
      title: "Giá trị đơn tối thiểu",
      dataIndex: "minOrderValue",
    },
    {
      title: "Số lượt áp dụng",
      dataIndex: "quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (status === "active" ? "Hoạt động" : "Vô hiệu hoá"),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
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
            title="Bạn có chắc muốn xóa khuyến mãi này?"
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
          placeholder="Tìm kiếm theo mã..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm khuyến mãi
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPromotions}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingPromotion ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingPromotion ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="code"
            label="Mã khuyến mãi"
            rules={[{ required: true, message: "Vui lòng nhập mã" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại giảm giá"
            rules={[{ required: true, message: "Vui lòng chọn loại" }]}
          >
            <Select>
              <Option value="percentage">Phần trăm (%)</Option>
              <Option value="fixed">Cố định (VNĐ)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="value"
            label="Giá trị giảm"
            rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="minOrderValue"
            label="Giá trị đơn hàng tối thiểu"
            rules={[{ required: true, message: "Vui lòng nhập giá trị tối thiểu" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượt áp dụng"
            rules={[{ required: true, message: "Vui lòng nhập số lượt áp dụng" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Vô hiệu hoá</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="Hạn sử dụng"
            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Promotion;
