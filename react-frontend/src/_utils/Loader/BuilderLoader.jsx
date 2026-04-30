import ContentLoader from 'react-content-loader';
import React from 'react';

const BuilderLoader = (props) => {
  return (
    <ContentLoader
      height={60}
      uniqueKey="key"
      style={{ width: '100%' }}
      backgroundColor="#ffffff"
      foregroundColor="#fbfbfb"
      {...props}
    >
      <rect x="0" y="0" rx="4" ry="4" width="100%" height="60" />
    </ContentLoader>
  );
};

BuilderLoader.metadata = {
  name: 'Shaheer Ali',
  github: 'itsmeshaheerali',
  description:
    'This loader exactly fit inside your bootrstrap card component no override happens like existing DataTable Loader',
  filename: 'BootstrapCardDataTable',
};

export default BuilderLoader;
