import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {useForm, SubmitHandler} from "react-hook-form";
import {REGISTER_FORM} from "../data";
import {yupResolver} from "@hookform/resolvers/yup";
import {registerSchema} from "../validation";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInput>({resolver: yupResolver(registerSchema)});

  // ** Handlers ** //
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    /**
     * * 1 - Pending => Loading
     * * 2 - Fulfilled => Success => (optional)
     * * 3 - Rejected => Failed => (optional)
     */
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
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
