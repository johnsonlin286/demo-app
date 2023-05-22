import API from "./config";

export const fetchAllPosts = async (
  exclude?: string,
  skip?: number,
  limit?: number,
  token?: string
) => {
  return new Promise(async (resolve, reject) => {
    const reqBody = {
      query: `
        query photos($exclude: ID, $skip: Float, $limit: Float) {
          photos(exclude: $exclude, skip: $skip, limit: $limit) {
            data {
              _id imageUrl caption 
              user {
                _id name
              }
              likes {
                _id
              }
            }
            total
          }
        }
      `,
      variables: {
        exclude: exclude || null,
        skip: skip,
        limit: limit || 20,
      },
    };
    return await API(reqBody, token)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchPhoto = async (photoId: string) => {
  return new Promise(async (resolve, reject) => {
    const reqBody = {
      query: `
        query photo($photoId: ID!) {
          photo(photoId: $photoId), {
            _id imageUrl caption
            user {
              _id name
            }
            likes {
              _id
              user {
                _id
              }
            }
          }
        }
      `,
      variables: {
        photoId: photoId,
      },
    };
    return await API(reqBody)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
