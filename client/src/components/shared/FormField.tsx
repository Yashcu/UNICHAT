import React from 'react';
import { UseFormRegister, FieldErrors, RegisterOptions, FieldValues } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  icon: React.ReactNode;
  register: UseFormRegister<FieldValues>;
  error: FieldErrors<FieldValues> | undefined;
  placeholder?: string;
  validationRules?: RegisterOptions; // Rules passed to register
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  icon,
  register,
  error,
  placeholder,
  validationRules
}) => {
  const fieldError = error?.[name];

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={name}
          type={type}
          {...register(name, validationRules)}
          className="input pl-10"
          placeholder={placeholder}
        />
      </div>
      {fieldError && (
        <p className="mt-1 text-sm text-red-600">{fieldError.message as string}</p>
      )}
    </div>
  );
};

export default FormField;
