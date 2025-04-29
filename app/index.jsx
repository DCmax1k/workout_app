// app/index.jsx
import { Redirect } from 'expo-router';
import { useUserStore } from '../stores/useUserStore';

export default function Index() {
  // Do Login check here
  const user = useUserStore((state) => state.user);
  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/dashboard" />;
}