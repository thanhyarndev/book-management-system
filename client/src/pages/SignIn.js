import React from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const SignIn = () => {
  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const res = await axios.post("http://localhost:3001/api/user/login", {
        email,
        password,
      });

      const { token } = res.data;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      message.success("Đăng nhập thành công!");
      window.location.href = "/dashboard";
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Đăng nhập thất bại, kiểm tra lại thông tin"
      );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Đăng nhập
        </Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
