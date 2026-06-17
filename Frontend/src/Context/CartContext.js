import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as cartService from '../Services/Api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const getCurrentUser = useCallback(() => {
        try {
            const fromContext = user || JSON.parse(localStorage.getItem('user'));
            if (!fromContext) return null;

            const id = fromContext.id ?? fromContext.user_id ?? null;
            return id ? { ...fromContext, id } : null;
        } catch {
            return null;
        }
    }, [user]);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const currentUser = getCurrentUser();
                if (currentUser?.id) {
                    const res = await cartService.getCart(currentUser.id);
                    setCart(res.data || []);
                } else {
                    setCart([]);
                }
            } catch (error) {
                console.error('Error al obtener carrito:', error);
            }
        };
        fetchCart();
    }, [user, getCurrentUser]);



    const normalizeProductForCart = (product) => {

        const id = product.id ?? product.product_id ?? product.productId;
        const name = product.name ?? product.nombre ?? product.title ?? 'Producto';
        const image = product.image ?? product.image_url ?? product.imagen ?? null;
        const precio = Number(product.price ?? product.precio ?? 0);

        return { id, name, image, precio };
    };

    const addItem = async (product, quantity = 1) => {
        const currentUser = getCurrentUser();

        if (!currentUser || !currentUser.id) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            navigate('/login');
            return;
        }

        const normalized = normalizeProductForCart(product);

        try {
            try {
                await cartService.addToCart(currentUser.id, normalized.id, quantity);
            } catch (err) {
                console.warn('No se pudo guardar en el backend (o no configurado).', err);
            }

            setCart(prev => {
                const existing = prev.find(i =>
                    (i.product_id ? i.product_id === normalized.id : i.id === normalized.id)
                );
                if (existing) {
                    return prev.map(i =>
                        (i.product_id ? i.product_id === normalized.id : i.id === normalized.id)
                            ? { ...i, quantity: (i.quantity || 1) + quantity }
                            : i
                    );
                }

                return [...prev, {
                    id: normalized.id,
                    name: normalized.name,
                    precio: normalized.precio,
                    image: normalized.image,
                    quantity
                }];
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };


    const updateItem = async (productId, quantity) => {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
            navigate('/auth');
            return;
        }

        try {
            await cartService.updateQuantity(currentUser.id, productId, quantity);
            setCart(prev =>
                prev.map(i =>
                    (i.product_id ? i.product_id === productId : i.id === productId) ? { ...i, quantity } : i
                )
            );
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    const removeItem = async (productId) => {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
            navigate('/auth');
            return;
        }

        try {
            await cartService.removeFromCart(currentUser.id, productId);
            setCart(prev => prev.filter(i => (i.product_id ? i.product_id !== productId : i.id !== productId)));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const clear = async () => {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
            navigate('/auth');
            return;
        }

        try {
            await cartService.clearCart(currentUser.id);
            setCart([]);
        } catch (error) {
            console.error('Error al limpiar carrito:', error);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart: addItem,
            updateQuantity: updateItem,
            removeFromCart: removeItem,
            clearCart: clear
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};
