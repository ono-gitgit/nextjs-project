import Image from "next/image";

type Prop = {
  icon?: string;
  iconDescription?: string;
  title: string;
  description?: string;
};
export default function IconAndTitle({
  icon,
  iconDescription,
  title,
  description,
}: Prop) {
  return (
    <>
      {icon && iconDescription && (
        <Image
          className="mt-[20px] mb-[-30px] mx-auto w-auto"
          src={icon}
          alt={iconDescription}
          width={100}
          height={30}
          priority
        />
      )}
      <h1 className="mt-3 text-center font-bold text-3xl font-serif">
        {title}
      </h1>
      <p className="max-w-[323px] text-sm">{description}</p>
    </>
  );
}
