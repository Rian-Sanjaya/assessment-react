import { Layout } from "antd";
import HeaderLayout from "../components/layout/Header";
import ListUser from "../components/user/ListUser";

function App() {
  const { Header, Content } = Layout;

  return (
    <Layout style={{ minWidth: 414 }}>
      <Header
        style={{ position: "fixed", zIndex: 1, width: "100%", background: "#fff" }}
      >
        <HeaderLayout />
      </Header>
      <Content
        className="content-layout-wrapper"
        style={{ padding: "0 16px", marginTop: 64 }}
      >
        <ListUser />
      </Content>
    </Layout>
  );
}

export default App;
