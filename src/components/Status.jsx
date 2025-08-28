import { Badge } from 'react-bootstrap';

export default function Status({ status }) {
    const s = status || 'PENDING';
    const v =
        s === 'COMPLETED' ? 'success' :
            s === 'FAILED' ? 'danger' :
                s === 'MIXED' ? 'secondary' : 'warning';
    return <Badge bg={v}>{s}</Badge>;
}
