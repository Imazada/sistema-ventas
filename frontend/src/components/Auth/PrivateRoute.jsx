import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const PrivateRoute = ({ allowedRoles = [] }) => {
    const { isAuthenticated, loading, user, isAdmin } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    
    if (!isAuthenticated) return <Navigate to="/login" />;

    // Si hay roles permitidos definidos, verificar si el usuario tiene uno de ellos
    if (allowedRoles.length > 0) {
        const userRole = user?.rol?.nombre || user?.rol;
        const hasRole = allowedRoles.includes(userRole) || (allowedRoles.includes('admin') && (userRole === 'admin' || isAdmin));
        
        if (!hasRole) {
            // Si es admin y no tiene acceso a la ruta, al dashboard
            // Si es cliente y no tiene acceso, a productos
            return <Navigate to={isAdmin ? "/" : "/productos"} replace />;
        }
    }

    return <Outlet />;
};
export default PrivateRoute;