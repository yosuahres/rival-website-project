import Image, { ImageProps } from 'next/image';
import { clsxm } from '@/lib/clsxm';

type NextImageProps = {
  use  ?: 'default' | 'fill';
  className?: string;
  alt: string;
} & ImageProps;

const NextImage = ({ use = 'default', className, alt, ...rest }: NextImageProps) => {
  if (use === 'fill') {
    return (
      <div className={clsxm('overflow-hidden', className)}>
        <Image alt={alt} fill className='object-cover' {...rest} />
      </div>
    );
  }

  return <Image alt={alt} className={clsxm(className)} {...rest} />;
};

export default NextImage;
