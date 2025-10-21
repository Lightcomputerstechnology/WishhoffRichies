import { useRouter } from 'next/router'

export default function ChooseDonationFlow() {
  const router = useRouter()
  const { id } = router.query // donation or wish id

  const handleLogin = () => {
    // Redirect to the login flow, preserving redirect after login
    router.push(`/login?redirect=/checkout/${id}`)
  }

  const handleGuest = () => {
    // Go to intermediate page for guest donation
    router.push(`/donate-as-guest?id=${id}`)
  }

  return (
    <div className="choose-flow">
      <h2>How would you like to donate?</h2>
      <p>Please select how you wish to continue with your donation.</p>

      <div className="options">
        <button onClick={handleLogin}>
          Sign in / Create Account
        </button>

        <button onClick={handleGuest}>
          Donate as Guest
        </button>
      </div>

      <style jsx>{`
        .choose-flow {
          max-width: 480px;
          margin: 3rem auto;
          padding: 2rem;
          text-align: center;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .options {
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