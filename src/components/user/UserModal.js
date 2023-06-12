import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { addUser, editUser, getLoading, getUsers } from "../../store/user";
import { Modal, Input, Button, Radio, DatePicker} from "antd";

function UserModal({ title, modalOpen, setModalOpen, currentUser }) {
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState(null);
  const users = useSelector(getUsers);
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  const { register, trigger, watch, setValue, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if(currentUser?.uuid) {
      setValue("nama", currentUser.nama);
      setValue("alamat", currentUser.alamat);
      setJenisKelamin(currentUser.jenis_kelamin)
      setTanggalLahir(moment(currentUser.tanggal_lahir));
      trigger();
    } else {
      reset();
      setJenisKelamin("Pria");
      setTanggalLahir(moment());
    }
  }, [currentUser, setValue, trigger, reset, watch])

  const handleCancel = () => {
    if(currentUser?.uuid) {
      setValue("nama", currentUser.nama);
      setValue("alamat", currentUser.alamat);
      setJenisKelamin(currentUser.jenis_kelamin);
      setTanggalLahir(moment(currentUser.tanggal_lahir));
      trigger();
    } else {
      reset();
      setJenisKelamin("Pria");
      setTanggalLahir(moment());
    }
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await trigger();
    if (
      Object.keys(errors).length > 0 || 
      !watch("nama") ||
      !tanggalLahir
    ) {
      return;
    }

    // validate duplicate nama
    let find;
    if (currentUser?.uuid) {
      find = users.filter(user => user.uuid && user.uuid !== currentUser.uuid && user.nama === watch("nama"));
    } else {
      find = users.filter(user => user.uuid && user.nama === watch("nama"));
    }
    if (find && find.length > 0) {
      alert("Duplicate Nama");
      return;
    }

    const user = {
      uuid: currentUser?.uuid ? currentUser.uuid : uuidv4(),
      nama: watch("nama"),
      alamat: watch("alamat"),
      jenis_kelamin: jenisKelamin,
      tanggal_lahir: tanggalLahir,
      created_at: currentUser?.uuid ? currentUser.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (currentUser?.uuid) {
      dispatch(editUser(user))
        .then(() => {
          setModalOpen(false);
        })
        .catch(err => {
          console.error("Error: ", err);
        })
    } else {
      dispatch(addUser([user]))
        .then(() => {
          setValue("nama", "");
          setValue("alamat", "");
          setModalOpen(false);
        })
        .catch(err => {
          console.error("Error: ", err);
        })
    }
  }

  const onInputChange = async (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    
    setValue(name, value);
    await trigger("nama");
  };

  const onAlamatChange = async (e) => {
    setValue("alamat", e.target.value);
    await trigger("alamat");
  };

  const onJenisKelaminChange = async (e) => {
    setJenisKelamin(e.target.value);
  }

  const onTanggalLahirChange = (date, dateString) => {
    setTanggalLahir(moment(date))
  }

  return (
    <Modal
      title={title}
      open={modalOpen}
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>Cancel</Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={e => handleSubmit(e)}>Simpan</Button>
      ]}
    >
      <form className="form-box" onSubmit={handleSubmit}>
        <div className="input-box">
          <div className="input-label">Nama</div>
          <Input 
            placeholder="Nama lengkap" 
            allowClear
            name="nama" 
            {...register("nama", {
              required: true,
            })}
            value={watch("nama")}
            onChange={e => onInputChange(e)}
          />
          {errors.nama && <span className="invalid-input">Nama harus diisi</span>}
        </div>
        <div className="input-box">
          <div className="input-label">Alamat</div>
          <Input 
            placeholder="Detil alamat" 
            allowClear
            name="alamat" 
            {...register("alamat")}
            value={watch("alamat")}
            onChange={e => onAlamatChange(e)}
          />
        </div>
        <div className="input-box">
          <span className="input-label jenis-kelamin">P / W:</span>
          <Radio.Group
            name="jenis_kelamin"
            value={jenisKelamin}
            onChange={e => onJenisKelaminChange(e)}
          >
            <Radio value={"Pria"}>Pria</Radio>
            <Radio value={"Wanita"}>Wanita</Radio>
          </Radio.Group>
        </div>
        <div className="input-box">
        <span className="input-label tanggal-lahir">Tanggal lahir:</span>
            <DatePicker
              allowClear={false}
              format={"DD MM YYYY"}
              value={tanggalLahir}
              onChange={onTanggalLahirChange}
            />
        </div>
      </form>
    </Modal>
  );
}

export default UserModal;