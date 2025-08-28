import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { avatarMap } from '../assets/avatars';

export default function AvatarSelectModal({ show, onClose, onSave, currentId = 'user' }) {
  const [selected, setSelected] = useState(currentId);

  // keep local state in sync if parent changes currentId
  useEffect(() => {
    setSelected(currentId);
  }, [currentId]);

  const labelFor = (id) => id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Choose Your Avatar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          {Object.entries(avatarMap).map(([id, src]) => {
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className="p-0 bg-transparent border-0"
                title={labelFor(id)}
              >
                <img
                  src={src}
                  alt={labelFor(id)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: active ? '3px solid #3A3F87' : '2px solid #e9ecef',
                  }}
                />
                <div className="text-center small mt-1">{labelFor(id)}</div>
              </button>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            onSave(selected);
            onClose();
          }}
        >
          Use this avatar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
