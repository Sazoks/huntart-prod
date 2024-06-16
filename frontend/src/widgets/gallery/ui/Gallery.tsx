import {FC} from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./Gallery.scss";

import Message from "../../../shared/ui/message/Message";
import { fetchNewArts, selectFeedName, selectStatus } from "../../../app/model/slices/artsSlice";
import { selectSubscriptionsCount } from "../../../app/model/slices/authSlice";


interface GalleryProps {
  onSetModalOpen?(imgId?: number): void;
}

const Gallery:FC<GalleryProps> = (props) => {
  // const dispatch  = useDispatch<ThunkDispatch>();

  const { arts } = useSelector(state => state.arts);
  const status = useSelector(selectStatus);
  const subscriptionsCount = useSelector(selectSubscriptionsCount);
  const activeFeedName = useSelector(selectFeedName);

  // useEffect(() => {
  //   dispatch(fetchNewArts());
  // }, []);

  const {onSetModalOpen} = props;

  const imagesGallery = arts.items?.map((img ?: {id: number, image: string}) => (
      <div className="masonry-brick masonry-brick--h"
           tabIndex={0}
           key={img?.id}
           onClick={() => onSetModalOpen?.(img?.id)}>
        <img className='masonry-img'
             src={img?.image}
          />
      </div>
    ));


  return (
    <div className="gallery">
      <div className="masonry">
        {arts.items?.length === 0 && !(status === 'loading') ? <Message msgTitle={"Изображения не найдены :с"}/> : imagesGallery}
        
      </div>
      {arts.items?.length === 0 && (status === 'loaded') && subscriptionsCount === 0 && (activeFeedName === 'подписки') ? 
          <Message 
            msgTitle="Кажется, Вы ни на кого не подписаны :с"
            msgText="Подпишитесь на любимых авторов, чтобы видеть их публикации в этой ленте"/> 
            
          : null}
      {(status === 'loading') ? <Message msgText={"Загрузка..."}/> : null}
    </div>
  )
}

export default Gallery;