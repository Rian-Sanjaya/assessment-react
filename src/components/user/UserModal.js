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

  // useEffect(() => {
  //   if (areas && areas.length > 0) {
  //     const filtered = areas.filter(area => area.city)
  //     const sorted = filtered.sort(sortArea);
  //     setAreasSorted(sorted);
  //   }

  //   if (sizes && sizes.length > 0) {
  //     setSizesSorted(sizes);
  //   }
  // }, [areas, sizes])

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
      // const area = areasSorted?.find(area => area.city.trim() === currentUser.area_kota.trim());
      // setValue("city", currentUser.area_kota);
      // setProvince(area?.province);
      setValue("alamat", currentUser.alamat);
      // setValue("jenis_kelamin", currentUser.jenis_kelamin);
      // setValue("tanggal_lahir", currentUser.tanggal_lahir);
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
    // console.log('state kel: ', jenisKelamin);
    await trigger();
    // console.log('kelamin: ', watch("jenis_kelamin"))
    // if (
    //   Object.keys(errors).length > 0 || 
    //   !watch("nama") || 
    //   !watch("alamat") ||
    //   !watch("jenis_kelamin") || 
    //   !watch("tanggal_lahir")
    // ) {
    //   return;
    // }
    if (
      Object.keys(errors).length > 0 || 
      !watch("nama") || 
      !watch("alamat") 
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
      // timestamp: Date.now().toString(),
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
          // setValue("city", "");
          // setProvince("");
          setValue("alamat", "");
          // setValue("jenis_kelamin", "");
          // setValue("tanggal_lahir", "");
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
    // console.log('kel: ', e.target.value)
    setJenisKelamin(e.target.value);
    // setValue("jenis_kelamin", e.target.value);
    // await trigger("jenis_kelamin");
    // console.log('kelam: ', watch("jenis_kelamin"))
  }

  const onTanggalLahirChange = (date, dateString) => {
    // console.log(date, dateString)
    // console.log('date: ', date);
    // console.log('date string: ', dateString)
    // console.log('date format: ', moment(date).format())
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
            // style={{ textTransform: "uppercase" }}
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
            {...register("alamat", {
              required: true,
            })}
            value={watch("alamat")}
            onChange={e => onAlamatChange(e)}
          />
          {errors.alamat && <span className="invalid-input">Alamat harus diisi</span>}
        </div>
        <div className="input-box">
          <span className="input-label jenis-kelamin">P / W:</span>
          <Radio.Group
            name="jenis_kelamin"
            // defaultValue={"Pria"}
            value={jenisKelamin}
            onChange={e => onJenisKelaminChange(e)}
          >
            <Radio value={"Pria"}>Pria</Radio>
            <Radio value={"Wanita"}>Wanita</Radio>
          </Radio.Group>
          <div>
            {errors.jenis_kelamin && <span className="invalid-input">P / W harus diisi</span>}
          </div>
        </div>
        <div className="input-box">
        <span className="input-label tanggal-lahir">Tanggal lahir:</span>
            <DatePicker
              // defaultValue={moment()}
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