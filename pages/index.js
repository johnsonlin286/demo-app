import { useEffect, useState } from "react";
import { API } from "../endpoints/api";
// import { PHOTOS, COMMENT } from '../endpoints/url';
import Cookies from "js-cookie";
import Header from "../components/header";
import GalleryGrid from "../components/gallery-grid";
import ThumbnailImg from "../components/thumbnail-img";
import { Icon } from "@iconify/react";
import loadingIcon from "@iconify/icons-mdi/loading";
import arrowDownOutline from "@iconify/icons-ion/arrow-down-outline";

export default function Home({ photosData }) {
  const [mountStat, setMountStat] = useState(false);
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [totalPost, setTotalPost] = useState(0);
  const [fetchData, setFetchData] = useState(true);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) setUser(JSON.parse(user));
    setMountStat(true);
  }, []);

  useEffect(() => {
    if (mountStat) {
      setData(photosData.photos.data);
      setTotalPost(photosData.photos.total);
      setFetchData(false);
    }
  }, [mountStat]);

  const fetchPhotos = async () => {
    try {
      setFetchData(true);
      const reqBody = {
        query: `
          query photos($skip: Float, $limit: Float) {
            photos(skip: $skip, limit: $limit) {
              data {
                _id
                imageUrl
                user {
                  email
                }
              }
              total
            }
          }
        `,
        variables: {
          skip: (data && data.length) || 0,
          limit: 10,
        },
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const result = response.data.photos.data;
      if (result && result.length > 0) {
        setData((prev) => [...prev, ...result]);
      }
      setFetchData(false);
    } catch (error) {
      setFetchData(false);
      console.log(error);
    }
  };

  const windowScroll = () => {
    let docOffsetheight = document.body.offsetHeight;
    if (window.innerHeight + window.scrollY >= docOffsetheight - 124) {
      if (data && data.length < totalPost && !fetchData) fetchPhotos();
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", windowScroll);
    return () => document.removeEventListener("scroll", windowScroll);
  }, [windowScroll]);

  return (
    <div className="home">
      <Header fixed title={"Home"} />
      <div
        className={`${
          !data && fetchData
            ? "flex h-screen justify-center "
            : data && !data.length > 0
            ? "flex h-screen justify-center items-end "
            : ""
        }px-1 md:px-0 pt-14 pb-20`}
      >
        {data && data.length > 0 ? (
          <GalleryGrid>
            {data.map((item, i) => (
              <ThumbnailImg
                key={i}
                src={item.imageUrl}
                alt={item.caption}
                href={`/photo/${item._id}`}
              />
            ))}
          </GalleryGrid>
        ) : !fetchData ? (
          <div className="flex flex-col justify-center items-center">
            <p>No post found! Start post your image here...</p>
            <Icon icon={arrowDownOutline} width="38" height="38" />
          </div>
        ) : null}
        {fetchData ? (
          <div className="flex justify-center items-center py-5">
            <Icon
              icon={loadingIcon}
              className="inline-block animate-spin text-lg align-text-top"
            />{" "}
            fetching...
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = context.req.cookies.auth_token || null;
    const reqBody = {
      query: `
        query photos($skip: Float, $limit: Float) {
          photos(skip: $skip, limit: $limit) {
            data {
              _id
              imageUrl
              user {
                email
              }
            }
            total
          }
        }
      `,
      variables: {
        skip: 0,
        limit: 20,
      },
    };
    const response = await API.post(process.env.API_URL, reqBody, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    });
    return {
      props: {
        photosData: response.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/505",
        statusCode: 307,
      },
    };
  }
}
