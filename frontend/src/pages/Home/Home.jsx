import "./Home.css";

// COMPONENTS
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

// HOOKS
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// REDUX
import { getPhotos, like } from "../../slices/photoSlice";
import { getUserDetails } from "../../slices/userSlice";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getUserDetails(user._id));
    dispatch(getPhotos());
  }, [dispatch, user._id]);

  const handleLike = (photo = null) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  if (loading) {
    return <p>Carregando</p>;
  }
  return (
    <div className="home">
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Ainda não há fotos publicadas,{" "}
          <Link to={`/users/${user._id}`}>Clique aqui!</Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
