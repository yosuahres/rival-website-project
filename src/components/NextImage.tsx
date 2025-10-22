import Image, { type ImageProps } from "next/image";
import { clsxm } from "@/lib/clsxm";

// Omit ref, onLoad, onError from ImageProps to redefine them explicitly
type NextImageBaseProps = Omit<ImageProps, "ref" | "onLoad" | "onError">;

type NextImageProps = {
  use?: "default" | "fill";
  className?: string;
  alt: string;
} & NextImageBaseProps;

const NextImage = ({
  use = "default",
  className,
  alt,
  ...rest
}: NextImageProps) => {
  if (use === "fill") {
    return (
      <div className={clsxm("overflow-hidden", className)}>
        <Image alt={alt} fill className="object-cover" {...rest} />
      </div>
    );
  }

  return <Image alt={alt} className={clsxm(className)} {...rest} />;
};

export default NextImage;
