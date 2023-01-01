import { useEffect, useState } from 'react';
import { API } from '../../endpoints/api';
import { PHOTOS } from '../../endpoints/url';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Button from '../../components/button';
import Header from '../../components/header';
import Textarea from '../../components/textarea';
import { Icon } from '@iconify/react';
import loadingIcon from '@iconify/icons-mdi/loading';

const EditPost = () => {
  const router = useRouter();
  const [postId, setPostId] = useState();
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
  });
  const [fetching, setFetching] = useState(false);
  const [errMsg, setErrMsg] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = Cookies.get('user');
    if (!user) {
      router.push('/signin');
      return;
    }
  }, []);

  useEffect(() => {
    if (router.query.id) setPostId(router.query.id);
  }, [router])
  
  useEffect(() => {
    if (postId) fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setFetching(true);
      const response = await API.get(PHOTOS + `/${postId}`);
      if (response.data.data) setFormData(response.data.data);
      setFetching(false);
    } catch (error) {
      console.log(error);
      router.push('/404');
      setFetching(false);
    }
  }

  const formValidation = (e) => {
    e.preventDefault();
    const err = {};
    if (!formData.imageUrl) {
      err.imageUrl = 'required!';
    } else delete err.imageUrl;
    if (!formData.caption) {
      err.caption = 'required!';
    } else delete err.caption;
    setErrMsg(err);
    if (Object.keys(err).length > 0) {
      return;
    };
    submitForm();
  };

  const submitForm = async () => {
    try {
      setSaving(true);
      const params = {
        imageUrl: formData.imageUrl,
        caption: formData.caption,
      };
      const response = await API.patch(PHOTOS + `/${postId}`, params);
      if (response.data.status === 200) {
        router.back();
      }
      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  }

  return (
    <div className="edit-post">
      <Header backBtn title="Edit Post"/>
      <div className="px-5 md:px-0 pt-4 pb-20">
        {
          fetching && (
            <div className="flex w-full h-screen justify-center items-center pt-14">
              <Icon icon={loadingIcon} className="inline-block animate-spin text-lg align-text-top"/> fetching...
            </div>
          )
        }
        {
          formData && (
            <form onSubmit={formValidation}>
              <div className="flex justify-center items-center min-w-full h-[300px] border-2 border-dashed rounded-md overflow-hidden">
                <img src={formData.imageUrl} className="max-w-full"/>
              </div>
              <Textarea
                id="inputCaption"
                label="Caption"
                placeholder="Add your nice caption here..."
                value={formData.caption}
                error={errMsg.caption || ''}
                className="py-4"
                onChange={(val) => {
                  setFormData(prev => (
                    {
                      ...prev,
                      caption: val,
                    }
                  ))
                }}
              />
              <div className="text-right">
                <Button color="primary" loading={saving} disabled={saving}>
                  Save
                </Button>
              </div>
            </form>
          )
        }
      </div>
    </div>
  );
};

export default EditPost;