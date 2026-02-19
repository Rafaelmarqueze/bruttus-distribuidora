import NextErrorComponent from 'next/error'

export default function Error(props) {
  return <NextErrorComponent {...props} />
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
