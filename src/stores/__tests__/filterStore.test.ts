import { act, renderHook } from '@testing-library/react-native';
import { useFilterStore } from '../filterStore';
import type { FilterMode } from '../../types/filter';

describe('filterStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useFilterStore());
    act(() => {
      result.current.setFilterMode('both');
      result.current.setHideRead(false);
    });
  });

  describe('filterMode', () => {
    it('should have default value of "both"', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.filterMode).toBe('both');
    });

    it('should update filter mode', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setFilterMode('priority');
      });

      expect(result.current.filterMode).toBe('priority');
    });

    it('should handle all filter modes', () => {
      const { result } = renderHook(() => useFilterStore());
      const modes: FilterMode[] = ['both', 'priority', 'time'];

      modes.forEach((mode) => {
        act(() => {
          result.current.setFilterMode(mode);
        });
        expect(result.current.filterMode).toBe(mode);
      });
    });
  });

  describe('hideRead', () => {
    it('should have default value of false', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.hideRead).toBe(false);
    });

    it('should toggle hideRead', () => {
      const { result } = renderHook(() => useFilterStore());
      
      act(() => {
        result.current.setHideRead(true);
      });

      expect(result.current.hideRead).toBe(true);

      act(() => {
        result.current.setHideRead(false);
      });

      expect(result.current.hideRead).toBe(false);
    });
  });
});

