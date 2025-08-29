/* eslint-disable @next/next/no-img-element */
import React from "react";

const NextImage = ({ src, alt, width, height, ...rest }) => {
  return <img src={src} alt={alt} width={width} height={height} {...rest} />;
};

export default NextImage;
