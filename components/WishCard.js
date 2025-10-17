// components/WishCard.js
import Link from "next/link";

export default function WishCard({ wish }) {
  return (
    <article className="card">
      <h3>{wish.title}</h3>
      <p className="desc">{wish.description?.slice(0, 140)}{wish.description?.length > 140 ? "…" : ""}</p>
      <div className="card-meta">
        <span>Goal: ${wish.amount}</span>
        <Link href={`/wish/${wish.id}`}>
          <a className="btn small">View & Donate</a>
        </Link>
      </div>
    </article>
  );
}
