import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API } from "../../endpoints/api";
import Cookies from "js-cookie";
import { AppContext } from "../../context";

import Header from "../../components/header";
import InputField from "../../components/input-field";
import Button from '../../components/button';
import Link from "next/link";

export default function PageSignup() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
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
    if (!formState.name) {
      err.name = 'required!';
    } else delete err.name;
    if (!formState.email) {
      err.email = 'required!';
    } else delete err.email;
    if (!formState.password) {
      err.password = 'required!';
    } else if (formState.password.length < 6) {
      err.password = 'min 6 characters!';
    } else delete err.password;
    setErrMsg(err);
    if (Object.keys(err).length > 0) {
      return false;
    }
    formSubmit();
  }

  const formSubmit = async () => {
    try {
      setLoading(true);
      const reqBody = {
        query: `
          mutation Signup($name: String!, $email: String!, $password: String!) {
            signup(userInput: {name: $name, email: $email, password: $password}), {
              _id name email
            }
          }
        `,
        variables: {
          name: formState.name,
          email: formState.email,
          password: formState.password
        }
      };
      const response = await API.post(process.env.API_URL, reqBody);
      const data = response.data.signup;
      router.push('/signin');
      context.setToast({
        visible: true,
        text: `Your account ${data.email} has been successfully created!`
      });
    } catch (error) {
      setLoading(false);
      setErrMsg(current => (
        {
          ...current,
          global: error.data.errors[0].message
        }
      ));
    }
  }

  return (
    <div className="signup">
      <Header backBtn title={"Sign Up"}/>
      <div className="flex flex-col items-center py-20">
        <form className="w-1/2" onSubmit={formValidation}>
          {
            errMsg.global && <div className="w-full bg-red-100 rounded text-left p-2 mb-4"><p className="text-red-600">{errMsg.global}</p></div>
          }
          <InputField
            id="nameInput"
            label="Full Name"
            placeholder="Full Name"
            value={formState.name}
            error={errMsg.name || ''}
            className="mb-3"
            onChange={(val) => updateFormState('name', val)}
          />
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
            <Button color="primary" size="sm" disabled={loading} loading={loading} className="signup-btn">
              Sign Up
            </Button>
          </div>
        </form>
        <p className="text-center mt-6">
          Sign in <Link className="text-sky-400 hover:underline" href={'/signin'}>account</Link>
        </p>
      </div>
    </div>
  )
};