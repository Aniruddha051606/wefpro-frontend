import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => (
  <Helmet>
    <title>{title} | WefPro</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://wefpro-frontend.vercel.app/assets/jar-front.jpg" />
  </Helmet>
);

export default SEO;