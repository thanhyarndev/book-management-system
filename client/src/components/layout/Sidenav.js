import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TagOutlined,
  FileTextOutlined,
  BookOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Sidenav({ color }) {
  const dashboardIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>
  );

  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Book Manager</span>
      </div>
      <hr />

      <Menu theme="light" mode="inline">
        <Menu.Item key="dashboard">
          <NavLink to="/dashboard">
            <span className="icon">{dashboardIcon}</span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="books">
          <NavLink to="/books">
            <span className="icon">
              <BookOutlined style={{ color }} />
            </span>
            <span className="label">Quản lý sách</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="categories">
          <NavLink to="/categories">
            <span className="icon">
              <FolderOpenOutlined style={{ color }} />
            </span>
            <span className="label">Danh mục</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="orders">
          <NavLink to="/orders">
            <span className="icon">
              <ShoppingCartOutlined style={{ color }} />
            </span>
            <span className="label">Đơn hàng</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="users">
          <NavLink to="/users">
            <span className="icon">
              <UserOutlined style={{ color }} />
            </span>
            <span className="label">Người dùng</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="promotion">
          <NavLink to="/promotion">
            <span className="icon">
              <TagOutlined style={{ color }} />
            </span>
            <span className="label">Mã giảm giá</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="bookpos">
          <NavLink to="/bookpos">
            <span className="icon">
              <TagOutlined style={{ color }} />
            </span>
            <span className="label">Book POS</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="profile">
          <NavLink to="/profile">
            <span className="icon">
              <FileTextOutlined style={{ color }} />
            </span>
            <span className="label">Hồ sơ cá nhân</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    </>
  );
}

export default Sidenav;
