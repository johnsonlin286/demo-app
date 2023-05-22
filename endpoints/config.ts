import axios from "axios";
import Cookies from "js-cookie";
import { UserType } from "../utils/types";

const API_URL: any = process.env.API_URL;

type reqbodyType = {
  query: string;
  variables: any;
};

export default function API(reqbody: reqbodyType) {
  return new Promise(async (resolve, reject) => {
    let cookie = Cookies.get("user");
    let storage: UserType | undefined;
    if (cookie) {
      storage = JSON.parse(cookie);
    }
    await axios
      .post(API_URL, reqbody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: storage ? `Bearer ${storage?.token}` : null,
        },
      })
      .then((response) => {
        return resolve(response.data.data);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}
