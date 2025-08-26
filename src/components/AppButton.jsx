import RBButton from 'react-bootstrap/Button';

export default function AppButton({
  busy = false,
  busyText,
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <RBButton
      type={type}
      disabled={busy || disabled}
      {...props}
    >
      {busy ? (busyText ?? children) : children}
    </RBButton>
  );
}

