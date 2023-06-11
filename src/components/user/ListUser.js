import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Button, Table, Dropdown, Menu, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { titleChanged } from "../../store/header";
import { getUsers, getLoading, fetchUsers } from "../../store/user"
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

function ListUser() {
  // const [comoditiesFiltered, setComoditiesFiltered] = useState(null);
  // const [comoditySearch, setComoditySearch] = useState("");
  const [usersList, setUsersList] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const users = useSelector(getUsers);
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  // const { Search } = Input;
  
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
      // sorter: sortProvinsi,
    },
    {
      index: 3,
      title: "Tanggal Lahir",
      dataIndex: "tglLahir",
      // sorter: (a, b) => a.size - b.size,
    },
    {
      index: 4,
      title: "Tanggal Input",
      dataIndex: "createdAt",
      // sorter: (a, b) => a.price - b.price,
    },
    {
      index: 5,
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <span>
            <Space style={{ cursor: "pointer"}}>
              ...
            </Space>
          </span>
        </Dropdown>
      ),
    },
  ];

  const menu = (record) => (
    <Menu
      onClick={e => onClickAction(e, record)}
      items={[
        {
          label: 'Edit',
          key: '1',
        },
        {
          type: 'divider',
        },
        {
          label: 'Hapus',
          key: '3',
          style: { color: "#f5222d" },
        },
      ]}
    />
  );

  useEffect(() => {
    dispatch(titleChanged("User"));
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [];
    filtered = users.filter(user => user.uuid);
    const usersData = filtered.map(user => {
      const tmp = user;
      tmp.tglLahir = moment(tmp.tanggal_lahir).format("DD MMM YYYY");
      tmp.createdAt = moment(tmp.created_at).format("DD MM YYYY hh:mm")
      return tmp;
    })
    setUsersList(usersData)
  }, [users])

  // useEffect(() => {
  //   let filtered = [];
  //   if (comoditySearch) {
  //     filtered = comodities.filter(item => (
  //       item.uuid &&
  //       item.komoditas.trim().toLowerCase().includes(comoditySearch.trim()) 
  //     ));
  //   } else {
  //     filtered = comodities.filter(item => item.uuid);
  //   }
  //   const comoditiesData = filtered.map(comodity => {
  //     const tmp = comodity;
  //     tmp.formatedPrice = formatCurrency(comodity.price).replace(/[$]/g, '');
  //     return tmp;
  //   });
  //   setComoditiesFiltered(comoditiesData);
  // }, [comodities, comoditySearch])

  // const onSearchKomoditas = (value) => {
  //   setComoditySearch(value);
  // };

  const onAddUser = () => {
    setCurrentUser(emptyUser);
    setModalOpen(true);
  }

  const onClickAction = (e, record) => {
    if (e.key === "1") {
      setCurrentUser(record);
      setModalOpen(true);
    } 

    if (e.key === "3") {
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
          {/* <div>
            <Search placeholder="Cari Komoditas" onSearch={onSearchKomoditas} allowClear style={{ width: 200 }} />
          </div> */}
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
        <UserModal title="Tambah User" modalOpen={modalOpen} setModalOpen={setModalOpen} currentUser={currentUser} />
        <DeleteUser title="Hapus User" modalOpen={deleteOpen} setDeleteOpen={setDeleteOpen} currentUser={currentUser} />
      </>
    </div>
  )
}

export default ListUser;