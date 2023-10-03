/* eslint-disable react/prop-types */
import "./PhotoItem.css";

import { upload } from "../utils/config";
import { Link } from "react-router-dom";

const PhotoItem = ({ photo }) => {
  return (
    <div className="photo-item">
      {photo.image && (
        <div className="photo-box">
          <img src={`${upload}/photos/${photo.image}`} alt={photo.title} />
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
