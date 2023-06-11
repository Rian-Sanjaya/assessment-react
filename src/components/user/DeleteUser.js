import { Modal, Button} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getLoading } from "../../store/user";

function DeleteUser({ title, modalOpen, setDeleteOpen, currentUser }) {
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();

  const handleCancel = () => {
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(currentUser))
      .then(() => {
        setDeleteOpen(false);
      })
      .catch(err => {
        console.error("Error: ", err);
      });
  };

  return (
    <Modal
      title={title}
      open={modalOpen}
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleDelete}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
        <Button key="submit" type="danger" htmlType="submit" loading={loading} onClick={e => handleDelete(e)}>Hapus</Button>
      ]}
    >
      <div className="delete-content">
        <span>User&nbsp;</span>
        <span className="nama">{currentUser?.nama}</span>
        <span>&nbsp;akan dihapus?</span>
      </div>
    </Modal>
  );
}

export default DeleteUser;