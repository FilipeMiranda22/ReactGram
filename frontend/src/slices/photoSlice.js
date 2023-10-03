import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.publishPhoto(photo, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = photoService.getUserPhotos(id, token);

    return data;
  }
);

export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = photoService.deletePhoto(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getPhoto = createAsyncThunk(
  "photo/getphoto",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getPhoto(id, token);
    return data;
  }
);

export const like = createAsyncThunk("photo/like", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await photoService.like(id, token);

  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  return data;
});

export const comment = createAsyncThunk(
  "photo/comment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.comment(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getPhotos = createAsyncThunk(
  "photo/getall",
  async (_, thunkAPI) => {
    //Essa underline significa que os dados não são necessários, queria apenas pegar o thunkAPI
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getPhotos(token);

    return data;
  }
);

export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.searchPhotos(query, token);

    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        if (state.photo.likes) {
          const alreadyLiked = state.photo.likes.includes(
            action.payload.userId
          );
          state.photo.likes.includes(action.payload.userId);
          if (alreadyLiked) {
            state.photo.likes = state.photo.likes.filter(
              (id) => id !== action.payload.userId
            );
          } else {
            state.photo.likes.push(action.payload.userId);
          }
        }

        // Atualize a lista de fotos no estado do Redux
        state.photos = state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            const alreadyLiked = photo.likes.includes(action.payload.userId);
            return {
              ...photo,
              likes: alreadyLiked
                ? photo.likes.filter((id) => id !== action.payload.userId)
                : [...photo.likes, action.payload.userId],
            };
          }
          return photo;
        });
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo.comments.push(action.payload.comment);
        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
