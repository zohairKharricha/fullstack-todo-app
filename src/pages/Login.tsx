import {useState} from "react";
import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {LOGIN_FORM} from "../data";
import {useNavigate} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginSchema} from "../validation";
import {AxiosError} from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios.config";
import {IErrorResponse} from "../interfaces";

interface IFormInput {
  identifier: string;
  password: string;
}
const LoginPage = () => {
  // ** handlers ** //

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInput>({resolver: yupResolver(loginSchema)});

  // ** Handlers ** //
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // * 1 - Pending => Loading
    setIsLoading(true);

    try {
      // * 2 - Fulfilled => Success => (optional)
      const {status} = await axiosInstance.post("/auth/local", data);
      if (status === 200) {
        toast.success(
          "You will navigate to the home page after 2 seconds to login!",
          {
            position: "bottom-center",
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // * 3 - Rejected => Failed => (optional)
      console.log(error);
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  // ** render ** //
  const renderLoginForm = LOGIN_FORM.map(
    ({name, placeholder, type, validation}, idx) => (
      <div key={idx}>
        <Input
          type={type}
          placeholder={placeholder}
          {...register(name, {
            required: validation.required,
            minLength: validation.minLength,
          })}
        />
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
