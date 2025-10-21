// components/MakeAWishButton.js
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function MakeAWishButton() {
  const user = useUser();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push("/create-wish");
    } else {
      // Redirect to login with redirect query param
      router.push(`/login?next=/create-wish`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition"
    >
      ✨ Make a Wish
    </button>
  );
}
