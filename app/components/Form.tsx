import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Loading from "./Loading";
import { useRouter } from "next/navigation";

type form = {
  label: string;
  name: string;
  value: string | number;
  validationRule?: object;
  type: string;
  link: string;
  linkPath: string;
};
type argument = {
  [key: string]: string | number;
};
type Props = {
  icon: string;
  iconDescription: string;
  title: string;
  description: string;
  formArray: form[];
  onSubmit: (argument: argument) => void;
  isLoading: boolean;
  bottonName: string;
  children: React.ReactNode;
};

export default function Form({
  icon,
  iconDescription,
  title,
  description,
  formArray,
  onSubmit,
  isLoading,
  bottonName,
  children,
}: Props) {
  const router = useRouter();
  const defaultValues = formArray.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {} as Record<string, string | number>);

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });
  return (
    <>
      <main className="flex flex-col gap-[32px] row-start-2">
        {icon !== "" && (
          <Image
            className="mt-[-60px] mb-[-30px] mx-auto w-auto"
            src={icon}
            alt={iconDescription}
            width={100}
            height={30}
            priority
          />
        )}
        <h1 className="mt-3 font-bold text-3xl">{title}</h1>
        <p className="text-sm">{description}</p>
        <form
          className="gap-4 flex-col sm:flex-row"
          onSubmit={handleSubmit(() => {
            onSubmit(getValues());
          })}
        >
          {formArray.map((field, index) => (
            <div key={index} className="mb-8 flex flex-col items-start">
              <span className="text-[#F85F6A]">{field.label}</span>
              <input
                {...register(field.name, field.validationRule)}
                type={field.type}
                className="border-2 border-gray-500 bg-[#FAFAFA]"
              />
              <div className="text-red-500">{errors[field.name]?.message}</div>
              {field.link !== "" && (
                <a
                  onClick={() => router.push(field.linkPath)}
                  className="mt-5 text-blue-600 underline text-[13px]"
                >
                  {field.link}
                </a>
              )}
            </div>
          ))}
          <button
            type="submit"
            className=" rounded-[10px] border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#F85F6A] hover:bg-[#f3a4a9] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm text-amber-50 sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
          >
            {bottonName}
          </button>
        </form>
        {children}
      </main>

      {isLoading && <Loading />}
    </>
  );
}
