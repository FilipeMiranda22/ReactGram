import "./Profile.css";

import { upload } from "../../utils/config";

//COMPONENTS
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

//Hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getUserDetails } from "../../slices/userSlice";
import {
  publishPhoto,
  getUserPhotos,
  resetMessage,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  //photo
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  const resetComponentMessage = (hide = false) => {
    setTimeout(() => {
      dispatch(resetMessage());
      if (hide) {
        hideOrShowForms();
      }
    }, 5000);
  };

  const handleFile = (e) => {
    const image = e.target.files[0];

    setImage(image);
  };

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));
    resetComponentMessage();
  };

  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      id: editId,
    };

    dispatch(updatePhoto(photoData));

    resetComponentMessage(true);
  };

  const handleCancelEdit = () => {
    hideOrShowForms();
  };

  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }

    setEditId(photo._id);
    setEditTitle(photo.title);
    setEditImage(photo.image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const photoData = {
      title,
      image,
    };

    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    dispatch(publishPhoto(formData));

    setTitle("");

    resetComponentMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img
            src={`${upload}/users/${user.profileImage}`}
            onError={(e) => {
              // Se ocorrer um erro ao carregar a imagem do servidor, mude o src para a URL do Amazon S3
              e.target.src = `https://reactgramimg.s3.sa-east-1.amazonaws.com/users/${user.profileImage}`;
            }}
            alt={`${user.name}`}
          />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título para a foto:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img
                src={`${upload}/photos/${editImage}`}
                onError={(e) => {
                  e.target.src = `https://reactgramimg.s3.sa-east-1.amazonaws.com/photos/${editImage}`;
                }}
                alt={editTitle}
              />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Insira o novo título"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Atualizar" />
              <button
                className="cancel-btn"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancelar Edição
              </button>
            </form>
          </div>
          {errorPhoto && <Message message={errorPhoto} type="error" />}
          {messagePhoto && <Message message={messagePhoto} type="success" />}
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${upload}/photos/${photo.image}`}
                    alt={photo.title}
                    onError={(e) => {
                      e.target.src = `https://reactgramimg.s3.sa-east-1.amazonaws.com/photos/${photo.image}`;
                    }}
                  />
                )}
                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo._id)} />
                  </div>
                ) : (
                  <Link to={`/photos/${photo._id}`} className="actions">
                    <BsFillEyeFill />
                  </Link>
                )}
              </div>
            ))}
          {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
