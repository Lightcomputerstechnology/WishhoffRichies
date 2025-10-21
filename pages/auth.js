// pages/auth.js
import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUserWishes = async () => {
      if (!user) return;

      // Check if user already has wishes in your "wishes" table
      const { data, error } = await supabase
        .from('wishes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error checking wishes:', error);
        return;
      }

      if (data && data.length > 0) {
        router.push('/dashboard'); // user already has a wish
      } else {
        router.push('/create-wish'); // new user → go make a wish
      }
    };

    checkUserWishes();
  }, [user, supabase, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google']}
        />
      </div>
    </div>
  );
}
