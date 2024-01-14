import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {useForm, SubmitHandler} from "react-hook-form";
import {REGISTER_FORM} from "../data";
import {yupResolver} from "@hookform/resolvers/yup";
import {registerSchema} from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {IErrorResponse} from "../interfaces";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInput>({resolver: yupResolver(registerSchema)});

  // ** Handlers ** //
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // * 1 - Pending => Loading
    setIsLoading(true);

    try {
      // * 2 - Fulfilled => Success => (optional)
      const {status} = await axiosInstance.post("/auth/local/register", data);
      if (status === 200) {
        toast.success(
          "You will navigate to the login page after 2 seconds to login!",
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

  const renderRegisterForm = REGISTER_FORM.map(
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
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterForm}
        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>

        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>have an account?</span>
          <Link
            to={"/login"}
            className="underline text-indigo-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
