import { FC, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface IProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string;
  label: string;
}

export const CheckBox: FC<IProps> = (props) => {
  const { label, id, readOnly, disabled, ...rest } = props;
  const { register } = useFormContext();

  return (
    <div>
      <label htmlFor={id} className="inline-flex w-full items-center">
        <input
          type="checkbox"
          {...register(id)}
          {...rest}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          className="border-gray-30 rounded text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:ring-offset-0"
        />
        <span className="ml-2">{label}</span>
      </label>
    </div>
  );
};
