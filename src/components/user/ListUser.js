import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Button, Table, Space, Input } from "antd";
import { PlusOutlined, EyeOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { titleChanged } from "../../store/header";
import { getUsers, getLoading, fetchUsers } from "../../store/user"
import DetailUser from "./DetailUser";
import UserModal from "./UserModal";
import DeleteUser from "./DeleteUser";

const emptyUser = {
  uuid: "",
  nama: "",
  alamat: "",
  jenis_kelamin: "",
  tanggal_lahir: "",
  created_at: "",
  updated_at: "",
}

const sortNama = (a, b) => {
  const nameA = a.nama.toUpperCase();
  const nameB = b.nama.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

const sortJenisKelamin = (a, b) => {
  const nameA = a.jenis_kelamin.toUpperCase();
  const nameB = b.jenis_kelamin.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

function ListUser() {
  const [namaSearch, setNamaSearch] = useState("");
  const [usersList, setUsersList] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [titleModal, setTitleModal] = useState("");
  const users = useSelector(getUsers);
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  const { Search } = Input;
  
  const columns = [
    {
      index: 0,
      title: "Nama",
      dataIndex: "nama",
      sorter: sortNama,
    },
    {
      index: 1,
      title: "Alamat",
      dataIndex: "alamat",
    },
    {
      index: 2,
      title: "P/W",
      dataIndex: "jenis_kelamin",
      sorter: sortJenisKelamin,
    },
    {
      index: 3,
      title: "Tanggal Lahir",
      dataIndex: "tglLahir",
    },
    {
      index: 4,
      title: "Tanggal Input",
      dataIndex: "createdAt",
    },
    {
      index: 5,
      title: 'Aksi',
      key: 'aksi',
      render: (_, record) => (
        <Space>
          <button className="action-button" title="Lihat detil user" onClick={e => onClickAksi(e, record, "View")}><EyeOutlined /></button>
          <button className="action-button" title="Edit user" onClick={e => onClickAksi(e, record, "Edit")}><FormOutlined /></button>
          <button className="action-button" title="Hapus user" onClick={e => onClickAksi(e, record, "Delete")}><DeleteOutlined /></button>
        </Space>
      ),
    }
  ];

  useEffect(() => {
    dispatch(titleChanged("User"));
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [];
    if (namaSearch) {
      filtered = users.filter(item => (
        item.uuid &&
        item.nama.trim().toLowerCase().includes(namaSearch.trim())
      ))
    } else {
      filtered = users.filter(user => user.uuid);
    }
    const usersData = filtered.map(user => {
      const tmp = user;
      tmp.tglLahir = moment(tmp.tanggal_lahir).format("DD MMM YYYY");
      tmp.createdAt = moment(tmp.created_at).format("DD MMM YYYY hh:mm")
      return tmp;
    })
    setUsersList(usersData)
  }, [users, namaSearch])

  const onSearchNama = (value) => {
    setNamaSearch(value);
  };

  const onAddUser = () => {
    setTitleModal("Tambah User");
    setCurrentUser(emptyUser);
    setModalOpen(true);
  }

  const onClickAksi = (e, record, action) => {
    if (action === "View") {
      setTitleModal("Detil User");
      setCurrentUser(record);
      setDetailOpen(true);
    } else if (action === "Edit") {
      setTitleModal("Edit User");
      setCurrentUser(record);
      setModalOpen(true);
    } else if (action === "Delete") {
      setTitleModal("Hapus User");
      setCurrentUser(record);
      setDeleteOpen(true);
    }
  };

  return (
    <div
      className="content-layout-container"
    >
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Search placeholder="Cari Nama" onSearch={onSearchNama} allowClear style={{ width: 200 }} />
          </div>
          <div>
            <Button type="primary" onClick={onAddUser}>
              <PlusOutlined />
              Tambah User
            </Button>
          </div>
        </div>
        <div className="table-box">
          <Table 
            columns={columns} 
            dataSource={usersList}
            pagination={false} 
            showSorterTooltip={false}
            loading={loading}
            rowKey="uuid" 
            scroll={{ x: 568 }}
          />
        </div>
        <DetailUser title={titleModal} modalOpen={detailOpen} setDetailOpen={setDetailOpen} currentUser={currentUser} />
        <UserModal title={titleModal} modalOpen={modalOpen} setModalOpen={setModalOpen} currentUser={currentUser} />
        <DeleteUser title={titleModal} modalOpen={deleteOpen} setDeleteOpen={setDeleteOpen} currentUser={currentUser} />
      </>
    </div>
  )
}

export default ListUser;