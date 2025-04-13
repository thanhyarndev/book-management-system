import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  message,
} from "antd";
import axios from "axios";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  UserOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Home = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/dashboard/get-datas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải dữ liệu dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mã SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Số lượng bán",
      dataIndex: "totalSold",
      key: "totalSold",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📊 Tổng quan hệ thống</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={data?.totalRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={data?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sách"
              value={data?.totalBooks || 0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tồn kho"
              value={data?.totalStock || 0}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={data?.totalCustomers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Khách mới trong tháng"
              value={data?.newCustomersThisMonth || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="📚 Top 5 sách bán chạy">
        <Table
          columns={columns}
          dataSource={data?.topSellingBooks || []}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Home;
