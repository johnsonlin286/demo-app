import { useEffect, useState } from "react";
import { API } from "../../endpoints/api";
// import { SIGNIN } from "../../endpoints/url";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import Header from "../../components/header";
import InputField from "../../components/input-field";
import Button from "../../components/button";

export default function PageSignin() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errMsg, setErrMsg] = useState({});
  const [loading, setLoading] = useState();

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) router.push('/profile');
  }, []);

  const updateFormState = (name, val) => {
    setFormState(current => (
      {
        ...current,
        [name]: val,
      }
    ));
    setErrMsg(current => (
      {
        ...current,
        global: '',
        [name]: '',
      }
    ));
  };

  const formValidation = (e) => {
    e.preventDefault();
    const err = {};
    if (!formState.email) {
      err.email = 'required!';
    } else delete err.email;
    if (!formState.password) {
      err.password = 'required!';
    } else delete err.password;
    setErrMsg(err);
    if (Object.keys(err).length > 0) {
      return false;
    }
    formSubmit();
  };

  const formSubmit = async () => {
    try {
      setLoading(true);
      const reqBody = {
        query: `
          query Signin($email: String!, $password: String!) {
            signin(email: $email, password: $password), {
              _id
              name
              email
              token
            }
          }
        `,
        variables: {
          email: formState.email,
          password: formState.password
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const data = response.data.signin;
      const expireTime = new Date();
      expireTime.setTime(expireTime.getTime() + 24 * 3600 * 1000);
      Cookies.set('auth_token', data.token, { expires: expireTime });
      Cookies.set('user', JSON.stringify({id: data._id, name: data.name, email: data.email}), { expires: 1 });
      setLoading(false);
      router.push('/profile');
    } catch (err) {
      setLoading(false);
      setErrMsg(current => (
        {
          ...current,
          global: 'invalid email or password!'
        }
      ));
    }
  }

  return (
    <div className="signin">
      <Header backBtn backRoute="/" title="Sign in"/>
      <div className="flex flex-col items-center py-20">
        <form onSubmit={formValidation}>
          {
            errMsg.global && <div className="w-full bg-red-100 rounded text-left p-2 mb-4"><p className="text-red-600">{errMsg.global}</p></div>
          }
          <InputField
            id="emailInput"
            label="Email"
            placeholder="Email"
            value={formState.email}
            error={errMsg.email || ''}
            className="mb-3"
            onChange={(val) => updateFormState('email', val)}
          />
          <InputField
            id="pwdInput"
            type="password"
            label="Password"
            placeholder="Password"
            value={formState.password}
            error={errMsg.password || ''}
            className="mb-5"
            onChange={(val) => updateFormState('password', val)}
          />
          <div className="text-right">
            <Button color="primary" size="sm" disabled={loading} loading={loading}>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};