import { API } from "../endpoints/api";
import { LIKE } from "../endpoints/url";

export const likePost = (photoId) => {
  return new Promise((resolve, reject) => {
    API.post(LIKE, { "photo_id": photoId })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const unlikePost = (likeId) => {
  return new Promise((resolve, reject) => {
    API.delete(LIKE + `/${likeId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
