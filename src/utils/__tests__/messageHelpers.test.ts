import { formatTimestamp, formatPriority } from '../messageHelpers';

describe('messageHelpers', () => {
  describe('formatTimestamp', () => {
    it('should format a valid ISO timestamp correctly', () => {
      const timestamp = '2024-03-15T10:30:00Z';
      const result = formatTimestamp(timestamp);
      
      expect(result).toContain('March');
      expect(result).toContain('2024');
      expect(result).toContain('15');
      // formatTimestamp converts to local time, so check for time format rather than specific time
      expect(result).toMatch(/\d{1,2}:\d{2}/); // Matches time format like "10:30" or "9:30 PM"
    });

    it('should handle different timezones', () => {
      const timestamp = '2024-01-01T00:00:00Z';
      const result = formatTimestamp(timestamp);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format timestamps with milliseconds', () => {
      const timestamp = '2024-12-25T12:00:00.000Z';
      const result = formatTimestamp(timestamp);
      
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatPriority', () => {
    it('should format priority as percentage', () => {
      expect(formatPriority(0.85)).toBe('85');
      expect(formatPriority(0.5)).toBe('50');
      expect(formatPriority(0.0)).toBe('0');
      expect(formatPriority(1.0)).toBe('100');
    });

    it('should clamp values below 0 to 0', () => {
      expect(formatPriority(-0.5)).toBe('0');
      expect(formatPriority(-1)).toBe('0');
    });

    it('should clamp values above 1 to 100', () => {
      expect(formatPriority(1.5)).toBe('100');
      expect(formatPriority(2.0)).toBe('100');
    });

    it('should handle edge cases', () => {
      expect(formatPriority(0.123)).toBe('12');
      expect(formatPriority(0.999)).toBe('100');
      expect(formatPriority(0.001)).toBe('0');
    });

    it('should round to nearest integer', () => {
      expect(formatPriority(0.855)).toBe('86');
      expect(formatPriority(0.854)).toBe('85');
    });
  });
});

