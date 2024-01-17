/* eslint-disable react/prop-types */
import { useState } from "react";
import "./PhotoItem.css";
import { upload } from "../utils/config";
import { Link } from "react-router-dom";

const PhotoItem = ({ photo }) => {
  const photoDir = `${upload}/photos/${photo.image}`;
  const s3ImageUrl = `https://reactgramimg.s3.sa-east-1.amazonaws.com/photos/${photo.image}`;
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <div className="photo-item">
      {photo.image && (
        <div className="photo-box">
          <img
            src={imageLoadError ? s3ImageUrl : photoDir}
            onError={() => {
              // Se ocorrer um erro ao carregar a imagem do servidor, mude o src para a URL do Amazon S3
              setImageLoadError(true);
            }}
            alt={photo.title}
          />
        </div>
      )}
      <h2>{photo.title}</h2>
      <div className="photo-author">
        Publicada por:
        <Link to={`/users/${photo.userId}`}> {photo.userName}</Link>
      </div>
    </div>
  );
};

export default PhotoItem;
