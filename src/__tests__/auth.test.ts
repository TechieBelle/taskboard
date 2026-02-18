import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/lib/store';

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({
      isAuthenticated: false,
      isInitialized: false,
      tasks: [],
      activityLog: [],
      searchQuery: '',
      priorityFilter: 'all',
    });
  });

  it('should login with correct credentials', () => {
    const result = useStore.getState().login('intern@demo.com', 'intern123', false);
    
    expect(result).toBe(true);
    expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = useStore.getState().login('wrong@email.com', 'intern123', false);

    expect(result).toBe(false);
    expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it('should reject invalid password', () => {
    const result = useStore.getState().login('intern@demo.com', 'wrongpassword', false);

    expect(result).toBe(false);
    expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it('should logout user', () => {
    useStore.getState().login('intern@demo.com', 'intern123', false);
    expect(useStore.getState().isAuthenticated).toBe(true);

    useStore.getState().logout();
    expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it('should persist authentication when remember me is true', () => {
    useStore.getState().login('intern@demo.com', 'intern123', true);
    
    // Reset state and reinitialize (simulating page refresh)
    useStore.setState({ isInitialized: false });
    useStore.getState().initializeStore();

    expect(useStore.getState().isAuthenticated).toBe(true);
  });

  it('should not persist authentication when remember me is false', () => {
    useStore.getState().login('intern@demo.com', 'intern123', false);
    
    useStore.getState().logout();
    useStore.setState({ isInitialized: false });
    useStore.getState().initializeStore();

    expect(useStore.getState().isAuthenticated).toBe(false);
  });
});