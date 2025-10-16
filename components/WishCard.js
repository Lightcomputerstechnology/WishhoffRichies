export default function WishCard({ wish }) {
  return (
    <div className="wish-card">
      <h3>{wish.title}</h3>
      <p>{wish.message}</p>
      <small>— {wish.sender}</small>
    </div>
  );
}
