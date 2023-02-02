import { useEffect, useState } from "react";
import { storage } from "../../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { API } from "../../endpoints/api";
import { PHOTOS } from "../../endpoints/url";
import decodeBase64Image from '../../utils/decode-base64';

import Header from "../../components/header";
import Textarea from "../../components/textarea";
import UploadField from "../../components/uploadField";
import Button from '../../components/button';

const CreatePost = () => {
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [formState, setFormState] = useState({
    imageUrl: '',
    caption: '',
  });
  const [imageFile, setImageFile] = useState();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let user = Cookies.get('user');
    if (!user) {
      router.push('/signin');
    } else {
      setUserData(JSON.parse(user));
    }
  }, []);

  const formValidation = (e) => {
    e.preventDefault();
    const err = {};
    if (!imageFile) {
      err.imageUrl = 'required!';
    } else delete err.imageUrl;
    if (!formState.caption) {
      err.caption = 'required!';
    } else delete err.caption;
    setErrMsg(err);
    if (Object.keys(err).length > 0) {
      return;
    };
    uploadImage();
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    const decodedImage = decodeBase64Image(imageFile, `${userData.id}.jpg`);
    const imageRef = ref(storage, `posts/${new Date().toISOString()}_${decodedImage.name}`);
    await uploadBytes(imageRef, decodedImage)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setFormState((prev) => (
            {
              ...prev,
              imageUrl: url,
            }
          ));
          setUploadSuccess(true);
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (uploadSuccess) submitPost();
  }, [uploadSuccess]);

  const submitPost = async () => {
    try {
      const reqBody = {
        query: `
          mutation post($imageUrl: String!, $caption: String!) {
            post(postInput: {imageUrl: $imageUrl, caption: $caption}), {
              _id
            }
          }
        `,
        variables: {
          imageUrl: formState.imageUrl,
          caption: formState.caption
        }
      };
      await API.post(process.env.API_URL, reqBody).then(() => {
        router.push(`/profile/${userData.id}`);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="create-post">
      <Header backBtn title="New Post"/>
      <div className="px-5 md:px-0 pt-4 pb-20">
        <UploadField error={errMsg.imageUrl || ''} onChange={(file) => setImageFile(file)}/>
        <form onSubmit={formValidation}>
          <Textarea
            id="inputCaption"
            label="Caption"
            placeholder="Add your nice caption here..."
            value={formState.caption}
            error={errMsg.caption || ''}
            disabled={!imageFile}
            className="py-4"
            onChange={(val) => {
              setFormState((prev) => (
                {
                  ...prev,
                  caption: val,
                }
              ));
            }}
          />
          <div className="text-right">
            <Button color="primary" loading={loading} disabled={!imageFile || loading}>
              Post It!
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;