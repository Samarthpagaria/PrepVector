import './App.css'
import { RouterProvider } from "react-router";
import { router } from './app.routes.tsx';
import { useAuthStore } from './store/useAuth.store.ts';
import { useGetMe } from './features/auth/hooks/useAuth.ts';
import { useEffect } from 'react';
import Loader from './components/shared/Loader';
import GlobalToast from './components/ui/GlobalToast.tsx';

function App() {
  const  setUser  = useAuthStore(state => state.setUser);
  const { data, isLoading } = useGetMe();

  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
    }
  }, [data, isLoading,setUser]);

  if (isLoading) return <Loader fullScreen text="Loading app..." />;
  
  return (
    <>
      <RouterProvider router={router} />
      <GlobalToast />
    </>
  )
}

export default App
