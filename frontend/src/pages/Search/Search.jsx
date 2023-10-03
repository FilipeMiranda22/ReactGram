import "./Search.css";

// hooks
import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

// Redux
import { searchPhotos, like } from "../../slices/photoSlice";
const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user: userAuth } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

  const handleLike = (photo = null) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="search">
      <h2>
        Você está buscando por: <span>{search}</span>
      </h2>
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer
              photo={photo}
              user={userAuth}
              handleLike={handleLike}
            />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Não foram encontrados resultados para a sua busca...
        </h2>
      )}
    </div>
  );
};

export default Search;
