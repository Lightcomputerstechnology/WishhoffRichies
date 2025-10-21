import { useRouter } from 'next/router'

export default function DonateAsGuest() {
  const router = useRouter()
  const { id } = router.query

  const continueAsGuest = () => {
    router.push(`/checkout/${id}?guest=true`)
  }

  return (
    <div className="guest-page">
      <h2>Donate as Guest</h2>
      <p>
        You can continue your donation without creating an account. 
        Please note that you won’t be able to track your donation history later.
      </p>

      <div className="actions">
        <button onClick={continueAsGuest}>
          Continue to Checkout
        </button>
        <button onClick={() => router.back()}>
          Go Back
        </button>
      </div>

      <style jsx>{`
        .guest-page {
          max-width: 480px;
          margin: 3rem auto;
          padding: 2rem;
          text-align: center;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }
        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:first-child {
          background: #0070f3;
          color: white;
        }
        button:first-child:hover {
          background: #005ac1;
        }
        button:last-child {
          background: #eaeaea;
        }
        button:last-child:hover {
          background: #dcdcdc;
        }
      `}</style>
    </div>
  )
}
