import { useRouter } from 'next/router'

export default function ChooseDonationFlow() {
  const router = useRouter()
  const { id } = router.query // donation or wish id

  return (
    <div className="choose-flow">
      <h2>How would you like to donate?</h2>
      <p>Choose one of the options below to continue.</p>
      <div className="options">
        <button onClick={() => router.push(`/login?redirect=/checkout/${id}`)}>
          Sign in / Create Account
        </button>
        <button onClick={() => router.push(`/checkout/${id}?guest=true`)}>
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
