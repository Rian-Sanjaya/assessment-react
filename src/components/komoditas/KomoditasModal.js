import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { addComodity, editComodity, getLoading, getComodities } from "../../store/komoditas";
import { getAreas, fetchAreas } from "../../store/area";
import { getSizes, fetchSizes } from "../../store/size";
import { Modal, Input, InputNumber, Select,  Button} from "antd";

const sortArea = (a, b) => {
  const nameA = a.city.trim().toUpperCase();
  const nameB = b.city.trim().toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

// const sortSizes = (a, b) => {
//   const nameA = a.size.trim().toUpperCase();
//   const nameB = b.size.trim().toUpperCase();
//   if (nameA < nameB) {
//     return -1;
//   }
//   if (nameA > nameB) {
//     return 1;
//   }

//   return 0;
// };

function KomoditasModal({ title, modalOpen, setModalOpen, currentComodity }) {
  const [areasSorted, setAreasSorted] = useState(null);
  const [province, setProvince] = useState("");
  const [sizesSorted, setSizesSorted] = useState(null);
  const comodities = useSelector(getComodities);
  const areas = useSelector(getAreas);
  const loading = useSelector(getLoading);
  const sizes = useSelector(getSizes);
  const dispatch = useDispatch();
  const { register, trigger, watch, setValue, reset, formState: { errors } } = useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchSizes());
  }, [dispatch])

  useEffect(() => {
    if (areas && areas.length > 0) {
      const filtered = areas.filter(area => area.city)
      const sorted = filtered.sort(sortArea);
      setAreasSorted(sorted);
    }

    if (sizes && sizes.length > 0) {
      setSizesSorted(sizes);
    }
  }, [areas, sizes])

  useEffect(() => {
    if(currentComodity?.uuid) {
      setValue("comodity", currentComodity.komoditas);
      const area = areasSorted?.find(area => area.city.trim() === currentComodity.area_kota.trim());
      setValue("city", currentComodity.area_kota);
      setProvince(area?.province);
      setValue("size", currentComodity.size);
      setValue("price", currentComodity.price);
      trigger();
    } else {
      reset();
    }
  }, [currentComodity, areasSorted, setValue, trigger, reset, watch])

  const handleCancel = () => {
    if(currentComodity?.uuid) {
      setValue("comodity", currentComodity.komoditas);
      const area = areasSorted?.find(area => area.city.trim() === currentComodity.area_kota.trim());
      setValue("city", currentComodity.area_kota);
      setProvince(area?.province);
      setValue("size", currentComodity.size);
      setValue("price", currentComodity.price);
      trigger();
    } else {
      reset();
    }
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await trigger();
    if (
      Object.keys(errors).length > 0 || 
      !watch("comodity") || 
      !watch("city") ||
      !watch("size") || 
      !watch("price")
    ) {
      return;
    }

    // validate duplicate comodity
    let find;
    if (currentComodity?.uuid) {
      find = comodities.filter(comodity => comodity.uuid && comodity.uuid !== currentComodity.uuid && comodity.komoditas === watch("comodity"));
    } else {
      find = comodities.filter(comodity => comodity.uuid && comodity.komoditas === watch("comodity"));
    }
    if (find && find.length > 0) {
      alert("Duplicate Comodity");
      return;
    }

    const comodity = {
      uuid: currentComodity?.uuid ? currentComodity.uuid : uuidv4(),
      komoditas: watch("comodity"),
      area_kota: watch("city"),
      area_provinsi: province,
      size: watch("size"),
      price: watch("price").replace(/[,.]/g, ""),
      tgl_parsed: currentComodity?.uuid ? currentComodity.tgl_parsed : new Date().toISOString(),
      timestamp: Date.now().toString(),
    }

    if (currentComodity?.uuid) {
      dispatch(editComodity(comodity))
        .then(() => {
          setModalOpen(false);
        })
        .catch(err => {
          console.error("Error: ", err);
        })
    } else {
      dispatch(addComodity([comodity]))
        .then(() => {
          setValue("comodity", "");
          setValue("city", "");
          setProvince("");
          setValue("size", "");
          setValue("price", "");
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
    
    setValue(name, value.toUpperCase());
    await trigger("comodity");
  };

  const onAreaChange = async (value) => {
    const area = areasSorted.find(area => area.city.trim() === value.trim());
    setValue("city", value);
    setProvince(area.province);
    await trigger("city");
  };

  const onSizeChange = async (value) => {
    setValue("size", value);
    await trigger("size");
  };

  const onPriceChange = async (value) => {
    setValue("price", value);
    await trigger("price");
  };

  const onPriceKeyDown = (e) => {
    if (!/[0-9]/.test(e.key) && (e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight")) {
      e.preventDefault();
    }
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
        <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={e => handleSubmit(e)}>Save</Button>
      ]}
    >
      <form className="form-box" onSubmit={handleSubmit}>
        <div className="input-box">
          <div className="input-label">Komoditas</div>
          <Input 
            placeholder="Contoh: Nila" 
            allowClear
            name="comodity" 
            style={{ textTransform: "uppercase" }}
            {...register("comodity", {
              required: true,
            })}
            value={watch("comodity")}
            onChange={e => onInputChange(e)}
          />
          {errors.comodity && <span className="invalid-input">Komoditas harus diisi</span>}
        </div>
        <div className="input-box">
          <div className="input-label">Kota</div>
          <Select 
            placeholder="Pilih Kota"
            style={{ width: "100%" }} 
            name="city"
            {...register("city", {
              required: true,
            })}
            value={watch("city")}
            onChange={onAreaChange}
          >
            {areasSorted && areasSorted.length > 0 && areasSorted.map((area, i) => (
              <Option key={i} value={area.city}>{area.city}</Option>
            ))}
          </Select>
          {errors.city && <span className="invalid-input">Kota harus diisi</span>}
        </div>
        <div className="input-box">
          <div className="input-label">Provinsi</div>
          <Input 
            placeholder="Provinsi"
            disabled
            name="province"
            value={province}
          />
        </div>
        <div className="input-box">
          <div className="input-label">Ukuran</div>
          <Select 
            placeholder="Pilih Ukuran"
            style={{ width: "100%" }} 
            name="size"
            {...register("size", {
              required: true,
            })}
            value={watch("size")}
            onChange={onSizeChange}
          >
            {sizesSorted && sizesSorted.length > 0 && sizesSorted.map((size, i) => (
              <Option key={i} value={size.size}>{size.size}</Option>
            ))}
          </Select>
          {errors.size && <span className="invalid-input">Ukuran harus diisi</span>}
        </div>
        <div className="input-box">
          <div className="input-label">Harga</div>
          <InputNumber
            name="price" 
            min={1}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: "100%" }}
            {...register("price", {
              required: true,
            })}
            value={watch("price")}
            onChange={onPriceChange}
            onKeyDown={e => onPriceKeyDown(e)}
          />
          {errors.price && <span className="invalid-input">Harga harus diisi</span>}
        </div>
      </form>
    </Modal>
  );
}

export default KomoditasModal;