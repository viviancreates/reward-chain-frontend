import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import AvatarSelectModal from './AvatarSelectModal';
import { avatarMap } from '../assets/avatars'; // <- we’ll make this next

export default function ProfileInfo({ name, email, walletAddress }) {
  const [avatarId, setAvatarId] = useState('user');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('avatarId');
    if (saved && avatarMap[saved]) setAvatarId(saved);
  }, []);

  const handleSaveAvatar = (id) => {
    setAvatarId(id);
    localStorage.setItem('avatarId', id);
  };

  return (
    <div className="text-center mb-4">
      <img
        src={avatarMap[avatarId]}
        alt="Profile avatar"
        style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover' }}
      />
      <div className="mt-2">
        <Button size="sm" variant="outline-primary" onClick={() => setShowModal(true)}>
          Change avatar
        </Button>
      </div>

      <h2 className="fw-bold mt-3">{name || 'Your Profile'}</h2>

      <Card className="shadow-sm mt-3">
        <Card.Header className="bg-primary text-white fw-semibold">Profile Info</Card.Header>
        <Card.Body>
          {name && <p><strong>Name:</strong> {name}</p>}
          {email && <p><strong>Email:</strong> {email}</p>}
          <p className="fw-semibold">Send ETH or USDC to this address to fund your wallet.</p>
          <p><strong>Your Wallet Address:</strong></p>
          <div className="border rounded p-2 bg-light">{walletAddress || '—'}</div>
        </Card.Body>
      </Card>

      <AvatarSelectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAvatar}
        currentId={avatarId}
      />
    </div>
  );
}
