import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Notification, UIState } from './types';

interface UIStoreState extends UIState {
  // Notifications
  notifications: Notification[];
  
  // Navigation
  navigation_history: string[];
  can_go_back: boolean;
  can_go_forward: boolean;
  
  // Layout
  sidebar_collapsed: boolean;
  header_height: number;
  footer_visible: boolean;
  
  // Responsive
  is_mobile: boolean;
  is_tablet: boolean;
  is_desktop: boolean;
  screen_width: number;
  screen_height: number;
  
  // Performance
  render_count: number;
  last_render_time: number;
}

interface UIStoreActions {
  // Loading states
  setLoading: (key: string, loading: boolean) => void;
  setMultipleLoading: (states: Record<string, boolean>) => void;
  clearAllLoading: () => void;
  
  // Modal states
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  toggleModal: (key: string) => void;
  closeAllModals: () => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  
  // Navigation
  setCurrentPage: (page: string) => void;
  addToBreadcrumbs: (item: { label: string; path: string }) => void;
  setBreadcrumbs: (items: Array<{ label: string; path: string }>) => void;
  clearBreadcrumbs: () => void;
  goBack: () => void;
  goForward: () => void;
  
  // Layout
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setHeaderHeight: (height: number) => void;
  setFooterVisible: (visible: boolean) => void;
  
  // Responsive
  updateScreenSize: (width: number, height: number) => void;
  setBreakpoints: () => void;
  
  // Performance
  incrementRenderCount: () => void;
  updateRenderTime: () => void;
  
  // Utilities
  showSuccessNotification: (title: string, message: string) => void;
  showErrorNotification: (title: string, message: string) => void;
  showWarningNotification: (title: string, message: string) => void;
  showInfoNotification: (title: string, message: string) => void;
  
  // Bulk operations
  resetUI: () => void;
  resetNotifications: () => void;
  resetModals: () => void;
}

type UIStore = UIStoreState & UIStoreActions;

const initialState: UIStoreState = {
  // Basic UI state
  sidebar_open: true,
  loading_states: {},
  modal_states: {},
  current_page: '/',
  breadcrumbs: [],
  
  // Notifications
  notifications: [],
  
  // Navigation
  navigation_history: ['/'],
  can_go_back: false,
  can_go_forward: false,
  
  // Layout
  sidebar_collapsed: false,
  header_height: 64,
  footer_visible: true,
  
  // Responsive
  is_mobile: false,
  is_tablet: false,
  is_desktop: true,
  screen_width: 1920,
  screen_height: 1080,
  
  // Performance
  render_count: 0,
  last_render_time: Date.now(),
};

export const useUIStore = create<UIStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // Loading states
      setLoading: (key, loading) => set((state) => ({
        loading_states: {
          ...state.loading_states,
          [key]: loading,
        },
      })),
      
      setMultipleLoading: (states) => set((state) => ({
        loading_states: {
          ...state.loading_states,
          ...states,
        },
      })),
      
      clearAllLoading: () => set({ loading_states: {} }),
      
      // Modal states
      openModal: (key) => set((state) => ({
        modal_states: {
          ...state.modal_states,
          [key]: true,
        },
      })),
      
      closeModal: (key) => set((state) => ({
        modal_states: {
          ...state.modal_states,
          [key]: false,
        },
      })),
      
      toggleModal: (key) => set((state) => ({
        modal_states: {
          ...state.modal_states,
          [key]: !state.modal_states[key],
        },
      })),
      
      closeAllModals: () => set({ modal_states: {} }),
      
      // Notifications
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
        
        // Auto-remove notification if duration is specified
        if (notification.duration && !notification.persistent) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      
      // Navigation
      setCurrentPage: (page) => set((state) => {
        const newHistory = [...state.navigation_history];
        const currentIndex = newHistory.length - 1;
        
        // Add to history if it's a new page
        if (newHistory[currentIndex] !== page) {
          newHistory.push(page);
        }
        
        return {
          current_page: page,
          navigation_history: newHistory,
          can_go_back: newHistory.length > 1,
          can_go_forward: false,
        };
      }),
      
      addToBreadcrumbs: (item) => set((state) => ({
        breadcrumbs: [...state.breadcrumbs, item],
      })),
      
      setBreadcrumbs: (items) => set({ breadcrumbs: items }),
      
      clearBreadcrumbs: () => set({ breadcrumbs: [] }),
      
      goBack: () => set((state) => {
        if (!state.can_go_back) return state;
        
        const newHistory = [...state.navigation_history];
        newHistory.pop();
        const previousPage = newHistory[newHistory.length - 1];
        
        return {
          current_page: previousPage,
          navigation_history: newHistory,
          can_go_back: newHistory.length > 1,
          can_go_forward: true,
        };
      }),
      
      goForward: () => {
        // Implementation would depend on how forward navigation is handled
        // This is a simplified version
        console.log('Forward navigation not implemented');
      },
      
      // Layout
      toggleSidebar: () => set((state) => ({
        sidebar_open: !state.sidebar_open,
      })),
      
      setSidebarOpen: (open) => set({ sidebar_open: open }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebar_collapsed: collapsed }),
      
      setHeaderHeight: (height) => set({ header_height: height }),
      
      setFooterVisible: (visible) => set({ footer_visible: visible }),
      
      // Responsive
      updateScreenSize: (width, height) => set({
        screen_width: width,
        screen_height: height,
      }),
      
      setBreakpoints: () => set((state) => {
        const { screen_width } = state;
        return {
          is_mobile: screen_width < 768,
          is_tablet: screen_width >= 768 && screen_width < 1024,
          is_desktop: screen_width >= 1024,
        };
      }),
      
      // Performance
      incrementRenderCount: () => set((state) => ({
        render_count: state.render_count + 1,
      })),
      
      updateRenderTime: () => set({
        last_render_time: Date.now(),
      }),
      
      // Utilities
      showSuccessNotification: (title, message) => {
        get().addNotification({
          type: 'success',
          title,
          message,
          duration: 5000,
        });
      },
      
      showErrorNotification: (title, message) => {
        get().addNotification({
          type: 'error',
          title,
          message,
          duration: 8000,
          persistent: true,
        });
      },
      
      showWarningNotification: (title, message) => {
        get().addNotification({
          type: 'warning',
          title,
          message,
          duration: 6000,
        });
      },
      
      showInfoNotification: (title, message) => {
        get().addNotification({
          type: 'info',
          title,
          message,
          duration: 4000,
        });
      },
      
      // Bulk operations
      resetUI: () => set(initialState),
      
      resetNotifications: () => set({ notifications: [] }),
      
      resetModals: () => set({ modal_states: {} }),
    })),
    {
      name: 'ui-store',
    }
  )
);
