import Alert from 'react-bootstrap/Alert';

export default function StatusMessage({ error, success }) {
  if (error) {
    return <Alert variant="danger" className="mb-3">{error}</Alert>;
  }
  if (success) {
    return <Alert variant="success" className="mb-3">{success}</Alert>;
  }
  return null;
}
