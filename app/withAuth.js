import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
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

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
