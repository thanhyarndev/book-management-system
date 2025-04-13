import React, { useEffect, useState } from "react";
import { Table, Input, Tag, message, Modal, Descriptions } from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách đơn hàng");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(value) ||
        order.customerPhone.includes(value)
    );
    setFilteredOrders(filtered);
  };

  const showModal = (record) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedOrder(null);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "id",
      render: (text) => <span>{text.slice(-6).toUpperCase()}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
    },
    {
      title: "SĐT",
      dataIndex: "customerPhone",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (value) => `${value.toLocaleString()} ₫`,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => <a onClick={() => showModal(record)}>Xem</a>,
    },
  ];

  return (
    <div>
      <h3>Danh sách đơn hàng</h3>
      <Input
        placeholder="Tìm theo tên hoặc SĐT khách hàng"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?._id
          .slice(-6)
          .toUpperCase()}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedOrder && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Khách hàng">
              {selectedOrder.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">
              {selectedOrder.customerPhone}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {selectedOrder.note || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {selectedOrder.totalAmount.toLocaleString()} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm">
              <div>
                {selectedOrder.items.map((item, index) => (
                  <Tag color="blue" key={index}>
                    {`${item.title} x${item.quantity}`}
                  </Tag>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
