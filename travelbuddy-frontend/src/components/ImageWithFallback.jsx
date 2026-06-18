import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    e.target.onerror = null;
    setHasError(true);
  };

  const fallbackSrc = '/placeholder.svg';

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
