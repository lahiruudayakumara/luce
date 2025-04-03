import { LEVELS, defineCustomLevel } from '../../src/core/levels';

describe('Log Levels', () => {
  it('should have predefined levels', () => {
    expect(LEVELS.trace.value).toBe(5);
    expect(LEVELS.debug.value).toBe(10);
    expect(LEVELS.info.value).toBe(30);
    expect(LEVELS.warn.value).toBe(40);
    expect(LEVELS.error.value).toBe(50);
    expect(LEVELS.fatal.value).toBe(60);
  });

  it('should allow defining custom levels', () => {
    defineCustomLevel('custom', {
      value: 25,
      label: 'CUSTOM',
      emoji: '🌟',
      description: 'A custom level',
    });

    // Type assertion to bypass TypeScript error
    expect((LEVELS as any)['custom'].value).toBe(25);
    expect((LEVELS as any)['custom'].emoji).toBe('🌟');
  });

  it('should throw on duplicate level names', () => {
    expect(() =>
      defineCustomLevel('info', {
        value: 35,
        label: 'INFO',
        emoji: 'ℹ️',
        description: 'Duplicate',
      })
    ).toThrow('Level "info" already exists');
  });
});
