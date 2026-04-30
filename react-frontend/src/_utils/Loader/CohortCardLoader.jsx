import ContentLoader from 'react-content-loader';
import React from 'react';

const CohortCardLoader = (props) => {
  return (
    <ContentLoader
      height={331}
      uniqueKey="key"
      style={{
        width: '100%',
        border: ' 1px solid #ecebeb',
        borderRadius: '12px',
        background: '#ffffff',
      }}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx="12" ry="12" width="100%" height="331" />
    </ContentLoader>
  );
};

CohortCardLoader.metadata = {
  name: 'Shaheer Ali',
  github: 'itsmeshaheerali',
  description:
    'This loader exactly fit inside your bootrstrap card component no override happens like existing DataTable Loader',
  filename: 'BootstrapCardDataTable',
};

export default CohortCardLoader;
