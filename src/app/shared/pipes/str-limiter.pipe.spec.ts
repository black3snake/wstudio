import { StrLimiterPipe } from './str-limiter.pipe';

describe('StrLimiterPipe', () => {
  it('create an instance', () => {
    const pipe = new StrLimiterPipe();
    expect(pipe).toBeTruthy();
  });
});
