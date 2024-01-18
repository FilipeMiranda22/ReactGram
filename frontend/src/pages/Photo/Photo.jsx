import "./Photo.css";
import { upload } from "../../utils/config";

//COMPONENTS
import { Link } from "react-router-dom";
import PhotoItem from "../../components/PhotoItem";
import LikeContainer from "../../components/LikeContainer";

//HOOKS
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getPhoto, like, comment } from "../../slices/photoSlice";
import { useEffect, useState } from "react";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { getUserDetails } from "../../slices/userSlice";

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading } = useSelector((state) => state.photo);

  const [commentText, setCommentText] = useState("");

  const [commentDetails, setCommentDetails] = useState([]);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      if (!photo._id) {
        // Se não há photo._id, obtém os detalhes da foto
        await dispatch(getPhoto(id));
      }

      if (photo.comments && photo.comments.length > 0) {
        const userDetails = await Promise.all(
          photo.comments.map(async (comment) => {
            const userDetail = await dispatch(getUserDetails(comment.userId));
            return { ...comment, user: userDetail };
          })
        );
        setCommentDetails(userDetails);
      }
    };

    fetchPhotoDetails();
  }, [dispatch, id, photo._id, photo.comments]);

  const handleLike = () => {
    dispatch(like(photo._id));

    resetMessage();
  };

  const handleComment = (e) => {
    e.preventDefault();

    const commentData = { comment: commentText, id: photo._id };

    dispatch(comment(commentData));

    setCommentText("");

    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="photo-container">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />

      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comentários - {photo.comments.length}</h3>
            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder="Insira o seu comentário..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ""}
              />
              <input type="submit" value="Enviar" />
            </form>
            {photo.comments.length === 0 && <p>Não há comentários</p>}
            {commentDetails.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  {comment.user.payload.profileImage && (
                    <img
                      src={`${upload}/users/${comment.user.payload.profileImage}`}
                      onError={(e) => {
                        e.target.src = `https://reactgramimg.s3.sa-east-1.amazonaws.com/users/${comment.user.payload.profileImage}`;
                      }}
                      alt={comment.userName}
                    />
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link>
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
