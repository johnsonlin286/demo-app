import API from "./config";

export const fetchAllPosts = async (exclude?: string, skip?: number) => {
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
        limit: 20,
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
