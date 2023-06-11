import { Layout } from "antd";
import HeaderLayout from "../components/layout/Header";
import Komoditas from "../components/komoditas/Komoditas";

function App() {
  const { Header, Content } = Layout;

  return (
    <Layout style={{ minWidth: 450 }}>
      <Header
        style={{ position: "fixed", zIndex: 1, width: "100%", background: "#fff" }}
      >
        <HeaderLayout />
      </Header>
      <Content
        className="content-layout-wrapper"
        style={{ padding: "0 16px", marginTop: 64 }}
      >
        <Komoditas />
      </Content>
    </Layout>
  );
}

export default App;
