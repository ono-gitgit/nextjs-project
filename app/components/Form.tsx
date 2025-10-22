import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import IconAndTitle from "@/app/components/IconAndTitle";
import { FormArray } from "@/app/types/types";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AutoResizeTextarea } from "./AutoResizeTextarea";

type formValues = {
  [key: string]: string | number;
};
type Props = {
  icon?: string;
  iconDescription?: string;
  title: string | ReactNode;
  description?: string;
  yenMark?: string;
  formArray: FormArray[];
  onSubmit: (formValues: formValues) => void;
  bottonName: string;
  children?: React.ReactNode;
};

export default function Form({
  icon,
  iconDescription,
  title,
  description,
  yenMark,
  formArray,
  onSubmit,
  bottonName,
  children,
}: Props) {
  const router = useRouter();
  const [fieldType, setFeildType] = useState(
    formArray.map((feiled) => {
      return feiled.type;
    })
  );
  const defaultValues = formArray.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {} as Record<string, string | number>);

  const {
    register,
    getValues,
    reset,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formArray]);
  return (
    <div className="justify-items-center">
      <main className="flex flex-col gap-[32px] row-start-2">
        <IconAndTitle
          icon={icon}
          iconDescription={iconDescription}
          title={title}
          description={description}
        />
        <form
          className="gap-4 flex-col max-w-70"
          onSubmit={handleSubmit(() => {
            onSubmit(getValues());
          })}
        >
          {formArray.map((field, index) => (
            <div key={index} className="mb-8 flex flex-col">
              <span className="max-w-[273px] whitespace-pre-line">
                {field.label}
              </span>
              {field.radioOptions !== undefined ? (
                <div className="flex flex-row flex-wrap ml-5 gap-6">
                  {field.radioOptions.map((choices, index) => (
                    <label key={index}>
                      <input
                        {...register(field.name, field.validationRule)}
                        maxLength={30}
                        type={field.type}
                        value={choices.value}
                        placeholder={field.placeholder}
                      />
                      <Image
                        className="h-auto w-auto rounded-[200px]"
                        src={choices.src}
                        alt={choices.alt}
                        width={40}
                        height={40}
                      />
                    </label>
                  ))}
                </div>
              ) : field.type === "textarea" ? (
                <label>
                  <AutoResizeTextarea
                    {...register(field.name, field.validationRule)}
                    className="border-2 w-[273px] border-gray-500 bg-[#FAFAFA] resize-none overflow-hidden"
                    maxLength={500}
                  />
                </label>
              ) : (
                <label className="relative">
                  <span className="text-2xl">{yenMark}</span>
                  <input
                    {...register(
                      field.name,
                      field.name !== "passwordConfirmation"
                        ? field.validationRule
                        : {
                            required: "パスワードは必須です",
                            maxLength: {
                              value: 20,
                              message:
                                "パスワードは２０文字以内で入力してください",
                            },
                            pattern: {
                              value: /^(?=.*[A-Z])(?=.*[a-z0-9])[A-Za-z0-9]+$/,
                              message:
                                "半角英数字と大文字のアルファベットを使用してください",
                            },
                            validate: (value: string) =>
                              value === watch("password") ||
                              "パスワードが一致しません",
                          }
                    )}
                    type={
                      formArray.map((feiled) => {
                        return feiled.type;
                      })[index]
                    }
                    min={0}
                    maxLength={30}
                    placeholder={field.placeholder}
                    className={`border-2 h-[33px] border-gray-500 bg-[#FAFAFA] ${
                      yenMark ? "w-[245px]" : "w-[273px]"
                    }`}
                  />
                  {fieldType[index] === "password" && (
                    <VisibilityOffOutlinedIcon
                      onClick={() => {
                        const newFieldType = { ...fieldType };
                        newFieldType[index] = "text";
                        setFeildType(newFieldType);
                      }}
                      className="absolute bg-white z-10 top-2 right-4"
                    />
                  )}
                  {fieldType[index] === "text" && field.type === "password" && (
                    <VisibilityOutlinedIcon
                      onClick={() => {
                        const newFieldType = { ...fieldType };
                        newFieldType[index] = "password";
                        setFeildType(newFieldType);
                      }}
                      className="absolute bg-white z-10 top-2 right-4"
                    />
                  )}
                </label>
              )}
              <div className="text-red-500 text-[14px] max-w-[280px]">
                {errors[field.name]?.message}
              </div>
              {field.linkPath !== undefined && (
                <a
                  onClick={() => router.push(field.linkPath as string)}
                  className="mt-5 text-blue-600 underline text-[13px]"
                >
                  {field.link}
                </a>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="rounded-[10px] border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#F85F6A] hover:bg-[#f3a4a9] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm text-amber-50 sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
          >
            {bottonName}
          </button>
        </form>
        {children}
      </main>
    </div>
  );
}
