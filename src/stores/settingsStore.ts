import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { AppSettings } from './types';

interface SettingsStoreState extends AppSettings {
  // Advanced settings
  debug_mode: boolean;
  analytics_enabled: boolean;
  crash_reporting: boolean;
  
  // Performance settings
  lazy_loading: boolean;
  image_optimization: boolean;
  cache_enabled: boolean;
  cache_size_mb: number;
  
  // Accessibility
  high_contrast: boolean;
  font_size_multiplier: number;
  reduce_motion: boolean;
  screen_reader_support: boolean;
  
  // Developer settings
  show_dev_tools: boolean;
  log_level: 'error' | 'warn' | 'info' | 'debug';
  api_timeout: number;
  
  // Backup and sync
  auto_backup: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  sync_enabled: boolean;
  last_backup: number | null;
  last_sync: number | null;
}

interface SettingsStoreActions {
  // Theme settings
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  // Language settings
  setLanguage: (language: string) => void;
  setOCRLanguage: (language: string) => void;
  
  // PDF settings
  setPDFViewerZoom: (zoom: number) => void;
  setPDFViewerFitMode: (mode: 'width' | 'height' | 'page') => void;
  
  // OCR settings
  setAutoOCR: (enabled: boolean) => void;
  setMaxFileSize: (size: number) => void;
  
  // Notifications
  setNotificationsEnabled: (enabled: boolean) => void;
  
  // Performance settings
  setLazyLoading: (enabled: boolean) => void;
  setImageOptimization: (enabled: boolean) => void;
  setCacheEnabled: (enabled: boolean) => void;
  setCacheSize: (sizeMb: number) => void;
  
  // Accessibility
  setHighContrast: (enabled: boolean) => void;
  setFontSizeMultiplier: (multiplier: number) => void;
  setReduceMotion: (enabled: boolean) => void;
  setScreenReaderSupport: (enabled: boolean) => void;
  
  // Developer settings
  setDebugMode: (enabled: boolean) => void;
  setShowDevTools: (enabled: boolean) => void;
  setLogLevel: (level: 'error' | 'warn' | 'info' | 'debug') => void;
  setApiTimeout: (timeout: number) => void;
  
  // Analytics and privacy
  setAnalyticsEnabled: (enabled: boolean) => void;
  setCrashReporting: (enabled: boolean) => void;
  
  // Backup and sync
  setAutoBackup: (enabled: boolean) => void;
  setBackupFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  setSyncEnabled: (enabled: boolean) => void;
  updateLastBackup: () => void;
  updateLastSync: () => void;
  
  // Bulk operations
  resetToDefaults: () => void;
  importSettings: (settings: Partial<SettingsStoreState>) => void;
  exportSettings: () => string;
  
  // Validation
  validateSettings: () => { isValid: boolean; errors: string[] };
  
  // Computed getters
  getEffectiveTheme: () => 'light' | 'dark';
  isSystemTheme: () => boolean;
  getAccessibilitySettings: () => {
    high_contrast: boolean;
    font_size_multiplier: number;
    reduce_motion: boolean;
    screen_reader_support: boolean;
  };
  getPerformanceSettings: () => {
    lazy_loading: boolean;
    image_optimization: boolean;
    cache_enabled: boolean;
    cache_size_mb: number;
  };
}

type SettingsStore = SettingsStoreState & SettingsStoreActions;

const defaultSettings: SettingsStoreState = {
  // Basic settings
  theme: 'system',
  language: 'en',
  ocr_language: 'eng',
  auto_ocr: false,
  notifications_enabled: true,
  max_file_size: 50, // MB
  pdf_viewer_zoom: 100,
  pdf_viewer_fit_mode: 'width',
  
  // Advanced settings
  debug_mode: false,
  analytics_enabled: true,
  crash_reporting: true,
  
  // Performance settings
  lazy_loading: true,
  image_optimization: true,
  cache_enabled: true,
  cache_size_mb: 100,
  
  // Accessibility
  high_contrast: false,
  font_size_multiplier: 1.0,
  reduce_motion: false,
  screen_reader_support: false,
  
  // Developer settings
  show_dev_tools: false,
  log_level: 'warn',
  api_timeout: 30000, // 30 seconds
  
  // Backup and sync
  auto_backup: true,
  backup_frequency: 'weekly',
  sync_enabled: false,
  last_backup: null,
  last_sync: null,
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        ...defaultSettings,
        
        // Theme settings
        setTheme: (theme) => set({ theme }),
        
        toggleTheme: () => set((state) => {
          const currentTheme = state.getEffectiveTheme();
          return { theme: currentTheme === 'light' ? 'dark' : 'light' };
        }),
        
        // Language settings
        setLanguage: (language) => set({ language }),
        setOCRLanguage: (language) => set({ ocr_language: language }),
        
        // PDF settings
        setPDFViewerZoom: (zoom) => set({ 
          pdf_viewer_zoom: Math.max(25, Math.min(500, zoom)) 
        }),
        setPDFViewerFitMode: (mode) => set({ pdf_viewer_fit_mode: mode }),
        
        // OCR settings
        setAutoOCR: (enabled) => set({ auto_ocr: enabled }),
        setMaxFileSize: (size) => set({ 
          max_file_size: Math.max(1, Math.min(500, size)) 
        }),
        
        // Notifications
        setNotificationsEnabled: (enabled) => set({ notifications_enabled: enabled }),
        
        // Performance settings
        setLazyLoading: (enabled) => set({ lazy_loading: enabled }),
        setImageOptimization: (enabled) => set({ image_optimization: enabled }),
        setCacheEnabled: (enabled) => set({ cache_enabled: enabled }),
        setCacheSize: (sizeMb) => set({ 
          cache_size_mb: Math.max(10, Math.min(1000, sizeMb)) 
        }),
        
        // Accessibility
        setHighContrast: (enabled) => set({ high_contrast: enabled }),
        setFontSizeMultiplier: (multiplier) => set({ 
          font_size_multiplier: Math.max(0.5, Math.min(3.0, multiplier)) 
        }),
        setReduceMotion: (enabled) => set({ reduce_motion: enabled }),
        setScreenReaderSupport: (enabled) => set({ screen_reader_support: enabled }),
        
        // Developer settings
        setDebugMode: (enabled) => set({ debug_mode: enabled }),
        setShowDevTools: (enabled) => set({ show_dev_tools: enabled }),
        setLogLevel: (level) => set({ log_level: level }),
        setApiTimeout: (timeout) => set({ 
          api_timeout: Math.max(5000, Math.min(120000, timeout)) 
        }),
        
        // Analytics and privacy
        setAnalyticsEnabled: (enabled) => set({ analytics_enabled: enabled }),
        setCrashReporting: (enabled) => set({ crash_reporting: enabled }),
        
        // Backup and sync
        setAutoBackup: (enabled) => set({ auto_backup: enabled }),
        setBackupFrequency: (frequency) => set({ backup_frequency: frequency }),
        setSyncEnabled: (enabled) => set({ sync_enabled: enabled }),
        updateLastBackup: () => set({ last_backup: Date.now() }),
        updateLastSync: () => set({ last_sync: Date.now() }),
        
        // Bulk operations
        resetToDefaults: () => set(defaultSettings),
        
        importSettings: (settings) => set((state) => ({
          ...state,
          ...settings,
        })),
        
        exportSettings: () => {
          const state = get();
          const exportData = {
            ...state,
            // Remove functions from export
            setTheme: undefined,
            toggleTheme: undefined,
            // ... (remove all action functions)
          };
          
          // Clean up the object
          Object.keys(exportData).forEach(key => {
            if (typeof exportData[key as keyof typeof exportData] === 'function') {
              delete exportData[key as keyof typeof exportData];
            }
          });
          
          return JSON.stringify(exportData, null, 2);
        },
        
        // Validation
        validateSettings: () => {
          const state = get();
          const errors: string[] = [];
          
          if (state.pdf_viewer_zoom < 25 || state.pdf_viewer_zoom > 500) {
            errors.push('PDF viewer zoom must be between 25% and 500%');
          }
          
          if (state.max_file_size < 1 || state.max_file_size > 500) {
            errors.push('Max file size must be between 1MB and 500MB');
          }
          
          if (state.font_size_multiplier < 0.5 || state.font_size_multiplier > 3.0) {
            errors.push('Font size multiplier must be between 0.5 and 3.0');
          }
          
          if (state.cache_size_mb < 10 || state.cache_size_mb > 1000) {
            errors.push('Cache size must be between 10MB and 1000MB');
          }
          
          if (state.api_timeout < 5000 || state.api_timeout > 120000) {
            errors.push('API timeout must be between 5 and 120 seconds');
          }
          
          return {
            isValid: errors.length === 0,
            errors,
          };
        },
        
        // Computed getters
        getEffectiveTheme: () => {
          const { theme } = get();
          if (theme === 'system') {
            // Check system preference
            if (typeof window !== 'undefined') {
              return window.matchMedia('(prefers-color-scheme: dark)').matches 
                ? 'dark' 
                : 'light';
            }
            return 'light';
          }
          return theme;
        },
        
        isSystemTheme: () => get().theme === 'system',
        
        getAccessibilitySettings: () => {
          const state = get();
          return {
            high_contrast: state.high_contrast,
            font_size_multiplier: state.font_size_multiplier,
            reduce_motion: state.reduce_motion,
            screen_reader_support: state.screen_reader_support,
          };
        },
        
        getPerformanceSettings: () => {
          const state = get();
          return {
            lazy_loading: state.lazy_loading,
            image_optimization: state.image_optimization,
            cache_enabled: state.cache_enabled,
            cache_size_mb: state.cache_size_mb,
          };
        },
      })),
      {
        name: 'app-settings',
        // Only persist certain settings
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          ocr_language: state.ocr_language,
          auto_ocr: state.auto_ocr,
          notifications_enabled: state.notifications_enabled,
          max_file_size: state.max_file_size,
          pdf_viewer_zoom: state.pdf_viewer_zoom,
          pdf_viewer_fit_mode: state.pdf_viewer_fit_mode,
          lazy_loading: state.lazy_loading,
          image_optimization: state.image_optimization,
          cache_enabled: state.cache_enabled,
          cache_size_mb: state.cache_size_mb,
          high_contrast: state.high_contrast,
          font_size_multiplier: state.font_size_multiplier,
          reduce_motion: state.reduce_motion,
          screen_reader_support: state.screen_reader_support,
          analytics_enabled: state.analytics_enabled,
          crash_reporting: state.crash_reporting,
          auto_backup: state.auto_backup,
          backup_frequency: state.backup_frequency,
          sync_enabled: state.sync_enabled,
        }),
      }
    ),
    {
      name: 'settings-store',
    }
  )
);
