import "./EditProfile.css";

//HOOKS
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//REDUX
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

//COMPONENTS
import Message from "../../components/Message";
import { upload } from "../../utils/config";
const EditProfile = () => {
  const dispatch = useDispatch();

  const { user, message, error, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setImageProfile] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleFile = (e) => {
    const image = e.target.files[0];
    setPreviewImage(image);
    setImageProfile(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      profileImage: profileImage ? profileImage : "",
      bio: bio ? bio : "",
      password: password ? password : "",
    };

    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 3000);
  };

  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${upload}/users/${user.profileImage}`
          }
          onError={(e) => {
            e.target.src = `https://reactgramimg.s3.sa-east-1.amazonaws.com/users/${user.profileImage}`;
          }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input type="email" placeholder="E-mail" value={email || ""} disabled />
        <label>
          <span>Imagem do perfil:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Descrição do perfil"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ""}
          />
        </label>
        <label htmlFor="">
          <span>Alterar senha:</span>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
        </label>
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" value="Aguarde.." disabled />}
        {error && <Message message={error} type="error" />}
        {message && <Message message={message} type="success" />}
      </form>
    </div>
  );
};

export default EditProfile;
