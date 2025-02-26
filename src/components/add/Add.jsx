import React, { useState } from "react";
import "./add.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { Checkbox, FormControlLabel } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const Add = ({ onClose }) => {
     const { register, handleSubmit } = useForm();
     const [imageUrls, setImageUrls] = useState([""]); // Динамик массивни бошлаймиз

     const notyf = new Notyf({
          position: { x: "center", y: "top" },
     });

     // Динамик тасвир URL қўшиш функцияси
     const handleImageChange = (index, value) => {
          const newImageUrls = [...imageUrls];
          newImageUrls[index] = value;
          setImageUrls(newImageUrls);
     };

     // Янги input қўшиш
     const addImageField = () => {
          setImageUrls([...imageUrls, ""]);
     };

     const addData = async (data) => {
          // Tasvirlar massivini qo'shamiz
          data.rasm = imageUrls;

          console.log(data); // Бу ерда юборилаётган маълумотларни текширинг
          try {
               await axios.post("https://otello-server.vercel.app/api/add", data);
               notyf.success("Gatovo! Mehmonxona qo'shildi.");
               onClose();
               window.location.reload();
          } catch (err) {
               console.error(err);
               notyf.error("Mahsulot qo'shishda xatolik yuz berdi.");
          }
     };

     return (
          <div className="modal">
               <div className="modal-content">
                    <button className="close" onClick={onClose}>
                         &times;
                    </button>
                    <form onSubmit={handleSubmit(addData)} className="form">
                         <input type="text" placeholder="URL иконки" {...register("icon", { required: true })} />
                         <input type="text" placeholder="Название" {...register("nomi", { required: true })} />
                         <input type="text" placeholder="Адрес" {...register("manzil", { required: true })} />
                         <input type="text" placeholder="Информация" {...register("malumoti", { required: true })} />
                         <input type="number" placeholder="Цена" {...register("narxi", { required: true })} />
                         <input type="text" placeholder="Кординаты" {...register("joylashuv", { required: true })} />
                         <input type="number" placeholder="Оценка" {...register("star", { required: true })} />



                         {/* Бир нечта тасвир URL'лари учун динамик майдонлар */}
                         <div>
                              <label>Добавить изображения</label>
                              {imageUrls.map((url, index) => (
                                   <input
                                        key={index}
                                        type="text"
                                        value={url}
                                        placeholder={`URL изображения ${index + 1}`}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                   />
                              ))}
                              <button type="button" onClick={addImageField}>
                                   Добавить еще одно изображение
                              </button>
                         </div>

                         {/* Чекбоксы */}
                         <div className="checkbox-group">
                              <FormControlLabel
                                   control={
                                        <Checkbox
                                             {...register("wifi")}
                                             sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                                        />
                                   }
                                   label={
                                        <div className="checkbox-label">
                                             <WifiIcon /> Бесплатный Wi-Fi
                                        </div>
                                   }
                              />
                              <FormControlLabel
                                   control={
                                        <Checkbox
                                             {...register("parking")}
                                             sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                                        />
                                   }
                                   label={
                                        <div className="checkbox-label">
                                             <LocalParkingIcon /> Парковка
                                        </div>
                                   }
                              />
                              <FormControlLabel
                                   control={
                                        <Checkbox
                                             {...register("breakfast")}
                                             sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                                        />
                                   }
                                   label={
                                        <div className="checkbox-label">
                                             <FreeBreakfastIcon /> Завтрак включен
                                        </div>
                                   }
                              />
                              <FormControlLabel
                                   control={
                                        <Checkbox
                                             {...register("pool")}
                                             sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                                        />
                                   }
                                   label={
                                        <div className="checkbox-label">
                                             <PoolIcon /> Бассейн
                                        </div>
                                   }
                              />
                              <FormControlLabel
                                   control={
                                        <Checkbox
                                             {...register("gym")}
                                             sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                                        />
                                   }
                                   label={
                                        <div className="checkbox-label">
                                             <FitnessCenterIcon /> Фитнес-зал
                                        </div>
                                   }
                              />
                         </div>

                         <button type="submit">Добавить</button>
                    </form>
               </div>
          </div>
     );
};

export default Add;
