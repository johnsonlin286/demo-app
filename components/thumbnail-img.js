import Image from './image';
import Link from 'next/link';
import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  href: PropTypes.string,
};

const defaultProps = {};

const ThumbnailImg = ({ src, alt, href }) => {
  return (
    <Link href={href} className="h-[130px] overflow-hidden">
      <Image src={src} alt={alt} wrapperClassName="relative" imageClassName="absolute aspect-[4/3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
    </Link>
  );
};

ThumbnailImg.propTypes = propTypes;
ThumbnailImg.defaultProps = defaultProps;

export default ThumbnailImg;