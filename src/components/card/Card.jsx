import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./card.css";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CircularProgress from '@mui/material/CircularProgress';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Card = () => {
     const [data, setData] = useState([]);
     const [deleteState, setDeleteState] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [editProduct, setEditProduct] = useState(null);
     const [openEditModal, setOpenEditModal] = useState(false);

     useEffect(() => {
          axios.get('https://otello-server.vercel.app/api/getall')
               .then(response => {
                    setData(response.data);
               })
               .catch(error => {
                    console.error('Ошибка при получении данных:', error);
               });
     }, [deleteState]);

     const handleDelete = (id) => {
          setIsLoading(true);
          axios.delete(`https://otello-server.vercel.app/api/deleted/${id}`)
               .then(() => {
                    setIsLoading(false);
                    setDeleteState(prev => !prev);
               })
               .catch(error => {
                    console.error("Ошибка при удалении продукта:", error);
                    setIsLoading(false);
               });
     };

     const handleEdit = (product) => {
          setEditProduct(product);
          setOpenEditModal(true);
     };

     const handleCloseEditModal = () => {
          setOpenEditModal(false);
     };

     const handleUpdate = (e) => {
          e.preventDefault();
          if (!editProduct) return;

          const updatedProduct = {
               rasm: Array.from(e.target.rasm).map(input => input.value), // Создаем массив из изображений
               icon: e.target.icon.value,
               nomi: e.target.nomi.value,
               malumoti: e.target.malumoti.value,
               manzil: e.target.manzil.value,
               narxi: e.target.narxi.value,
               joylashuv:e.target.joylashuv.value,
               wifi: e.target.wifi.checked,
               parking: e.target.parking.checked,
               breakfast: e.target.breakfast.checked,
               pool: e.target.pool.checked,
               gym: e.target.gym.checked,
          };

          axios.put(`https://otello-server.vercel.app/api/update/${editProduct._id}`, updatedProduct)
               .then(() => {
                    setOpenEditModal(false); // Закрыть модальное окно
                    setDeleteState(prev => !prev); // Обновить состояние
               })
               .catch(error => {
                    console.error('Ошибка при обновлении продукта:', error);
               });
     };

     return (
          <div className='card'>
               {data.map((item) => (
                    <div className="box" key={item._id}>
                         <div className="box__img">
                              <Swiper pagination={{ clickable: true }}>
                                   {item.rasm.map((imgSrc, index) => (
                                        <SwiperSlide key={index} className='box__img__map'>
                                             <img src={imgSrc} alt={item.nomi} className="product-image" />
                                        </SwiperSlide>
                                   ))}
                              </Swiper>
                         </div>
                         <div className="box__info__product">
                              <div className="card__title">
                                   <img src={item.icon} alt="Иконка" className="product-icon" />
                                   <p>{item.nomi}</p>
                              </div>
                              <h3><strong>Адрес:</strong> {item.manzil}</h3>
                              <h4><strong>Информация:</strong> {item.malumoti}</h4>
                              <span><strong>Кординаты:</strong> {item.joylashuv} $</span>
                              <span><strong>Цена:</strong> {item.narxi} $</span>

                              <div className="features">
                                   {item.wifi && <span><WifiIcon /> Wi-Fi</span>}
                                   {item.parking && <span><LocalParkingIcon /> Парковка</span>}
                                   {item.breakfast && <span><FreeBreakfastIcon /> Завтрак</span>}
                                   {item.pool && <span><PoolIcon /> Бассейн</span>}
                                   {item.gym && <span><FitnessCenterIcon /> Спортзал</span>}
                              </div>

                              <div className="delete__create" style={{ display: 'flex', alignItems: "center", gap: "4px" }}>
                                   <button onClick={() => handleDelete(item._id)} disabled={isLoading}>
                                        {isLoading ? <CircularProgress size={20} /> : 'Удалить'}
                                        {!isLoading && <DeleteIcon sx={{ color: "crimson", cursor: 'pointer' }} />}
                                   </button>
                                   <button onClick={() => handleEdit(item)}>
                                        Изменить
                                        <BorderColorIcon sx={{ color: "lightgreen", cursor: 'pointer' }} />
                                   </button>
                              </div>
                         </div>
                    </div>
               ))}

               {openEditModal && (
                    <div className='modal'>
                         <div className="modal-content">
                              <span className='close' onClick={handleCloseEditModal}>&times;</span>
                              <form onSubmit={handleUpdate} className='form'>
                                   {editProduct?.rasm.map((url, index) => (
                                        <input
                                             key={index}
                                             type="text"
                                             name="rasm"
                                             placeholder={`Url изображения ${index + 1}`}
                                             defaultValue={url}
                                        />
                                   ))}
                                   <label htmlFor="" className='card__icon' >Иконка</label>
                                   <input type="text" name="icon" placeholder='Url icon' defaultValue={editProduct?.icon || ''} />
                                   <input type="text" name="nomi" placeholder='Название' defaultValue={editProduct?.nomi || ''} />
                                   <input type="text" name="manzil" placeholder='Адрес' defaultValue={editProduct?.manzil || ''} />
                                   <input type="text" name="malumoti" placeholder="Информация" defaultValue={editProduct?.malumoti || ''} />
                                   <input type="number" name="narxi" placeholder='Цена' defaultValue={editProduct?.narxi || ''} />
                                   <input type="text" name="joylashuv" placeholder='Кординаты' defaultValue={editProduct?.joylashuv || ''} />


                                   <div className="checkbox-group">
                                        <label>
                                             <input type="checkbox" name="wifi" defaultChecked={editProduct?.wifi} />
                                             <div className="checkbox-label">
                                                  <WifiIcon style={{ marginRight: '4px' }} /> Wi-Fi
                                             </div>
                                        </label>
                                        <label>
                                             <input type="checkbox" name="parking" defaultChecked={editProduct?.parking} />
                                             <div className="checkbox-label">
                                                  <LocalParkingIcon style={{ marginRight: '4px' }} /> Парковка
                                             </div>
                                        </label>
                                        <label>
                                             <input type="checkbox" name="breakfast" defaultChecked={editProduct?.breakfast} />
                                             <div className="checkbox-label">
                                                  <FreeBreakfastIcon style={{ marginRight: '4px' }} /> Завтрак
                                             </div>
                                        </label>
                                        <label>
                                             <input type="checkbox" name="pool" defaultChecked={editProduct?.pool} />
                                             <div className="checkbox-label">
                                                  <PoolIcon style={{ marginRight: '4px' }} /> Бассейн
                                             </div>
                                        </label>
                                        <label>
                                             <input type="checkbox" name="gym" defaultChecked={editProduct?.gym} />
                                             <div className="checkbox-label">
                                                  <FitnessCenterIcon style={{ marginRight: '4px' }} /> Спортзал
                                             </div>
                                        </label>
                                   </div>
                                   <button type="submit">Сохранить изменения</button>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default Card;
