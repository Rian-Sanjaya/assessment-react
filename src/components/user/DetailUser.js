import { Modal, Button } from "antd";
import moment from "moment";

function UserDetail({ title, modalOpen, setDetailOpen, currentUser }) {
  const handleCancel = () => {
    setDetailOpen(false);
  }

  return (
    <Modal
      title={title}
      open={modalOpen}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button key="back" type="primary" onClick={handleCancel}>Tutup</Button>
      ]}
    >
      <section className="detail-container">
        <div className="item-box">
          <div className="item-label">
            Nama
          </div>
          <div className="item-content">
            { currentUser?.nama }
          </div>
        </div>
        <div className="item-box">
          <div className="item-label">
            Alamat
          </div>
          <div className="item-content">
            { currentUser?.alamat ? currentUser?.alamat : "N/A" }
          </div>
        </div>
        <div className="item-box">
          <span className="item-label inline">
            P/W: 
          </span>
          <span className="item-content">
            { currentUser?.jenis_kelamin }
          </span>
        </div>
        <div className="item-box">
          <span className="item-label inline">
            Tanggal Lahir:
          </span>
          <span className="item-content">
            { moment(currentUser?.tanggal_lahir).format("DD MMMM YYYY") }
          </span>
        </div>
        <div className="item-box">
          <span className="item-label inline">
            Tanggal Input:
          </span>
          <span className="item-content">
            { moment(currentUser?.created_at).format("DD MMMM YYYY hh:mm") }
          </span>
        </div>
      </section>
    </Modal>
  )
}

export default UserDetail;