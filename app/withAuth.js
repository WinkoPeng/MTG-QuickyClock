import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const userName = localStorage.getItem('userName');
        const adminName = localStorage.getItem('adminName');
        if (!userName && !adminName) {
          router.push('/');
        }
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
