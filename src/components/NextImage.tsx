import Image, { type ImageProps } from "next/image";
import type { Ref } from "react";
import { clsxm } from "@/lib/clsxm";

// Omit ref, onLoad, onError from ImageProps to redefine them explicitly
type NextImageBaseProps = Omit<ImageProps, "ref" | "onLoad" | "onError">;

type NextImageProps = {
  use?: "default" | "fill";
  className?: string;
  alt: string;
  // Redefine ref, onLoad, onError to ensure they are handled consistently
  ref?: Ref<HTMLImageElement>;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
} & NextImageBaseProps;

const NextImage = ({
  use = "default",
  className,
  alt,
  ref,
  onLoad,
  onError,
  ...rest
}: NextImageProps) => {
  if (use === "fill") {
    return (
      <div className={clsxm("overflow-hidden", className)}>
        <Image
          alt={alt}
          fill
          className="object-cover"
          ref={ref}
          onLoad={onLoad}
          onError={onError}
          {...rest}
        />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={clsxm(className)}
      ref={ref}
      onLoad={onLoad}
      onError={onError}
      {...rest}
    />
  );
};

export default NextImage;
