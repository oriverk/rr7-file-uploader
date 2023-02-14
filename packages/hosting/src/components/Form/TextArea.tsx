import { ComponentProps, FC } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { twJoin } from "tailwind-merge";

type Props = ComponentProps<'textarea'> & {
  id: string;
  label: string;
  validation?: RegisterOptions;
  helperText?: string;
}

export const TextArea: FC<Props> = (props) => {
  const { label, helperText = "", placeholder = "", id, readOnly, disabled, validation, ...rest } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  let stateClass;
  if (readOnly || disabled) {
    stateClass = "bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300";
  } else if (errors[id]) {
    stateClass = "focus:ring-red-500 border-red-500 focus:border-red-500";
  } else {
    stateClass = "focus:ring-primary-500 border-gray-300 focus:border-primary-500";
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-normal text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <textarea
          {...register(id, validation)}
          {...rest}
          name={id}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          className={twJoin("block w-full h-96 rounded-md shadow-sm", stateClass)}
          placeholder={placeholder}
          aria-describedby={id}
        />
        {errors[id] && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
          </div>
        )}
      </div>
      <div className="mt-1">
        {helperText !== "" && <p className="text-xs text-gray-500">{helperText}</p>}
        {errors.length && errors[id] ? (
          <span className="text-sm text-red-500">{JSON.stringify(errors[id]?.message, null, 2)}</span>
        ) : null}
      </div>
    </div>
  );
};
