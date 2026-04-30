import { describe, it, expect, vi } from 'vitest';
import { GameEngine } from '../GameEngine.js';
import { MAX_HP, MAX_LIVES, JUMP_POWER } from '../constants.js';

const noSync = () => {};

describe('GameEngine', () => {
  it('starts in title state with default values', () => {
    const engine = new GameEngine(noSync);
    expect(engine.gState).toBe('title');
    expect(engine.sc).toBe(0);
    expect(engine.lives).toBe(MAX_LIVES);
    expect(engine.pl.hp).toBe(MAX_HP);
  });

  it('startGame transitions to levelintro and resets score', () => {
    const onSync = vi.fn();
    const engine = new GameEngine(onSync);
    engine.sc = 999;
    engine.startGame();
    expect(engine.gState).toBe('levelintro');
    expect(engine.sc).toBe(0);
    expect(engine.lives).toBe(MAX_LIVES);
    expect(onSync).toHaveBeenCalled();
  });

  it('reset wipes all state back to defaults', () => {
    const engine = new GameEngine(noSync);
    engine.sc = 9999;
    engine.gState = 'playing';
    engine.lives = 1;
    engine.reset();
    expect(engine.sc).toBe(0);
    expect(engine.gState).toBe('title');
    expect(engine.lives).toBe(MAX_LIVES);
  });

  it('jump applies negative velocity when on ground and not dying', () => {
    const engine = new GameEngine(noSync);
    engine.pl.og = true;
    engine.pl.dying = false;
    engine.jump();
    expect(engine.pl.vy).toBe(JUMP_POWER);
    expect(engine.pl.og).toBe(false);
  });

  it('jump does nothing when airborne', () => {
    const engine = new GameEngine(noSync);
    engine.pl.og = false;
    engine.pl.vy = 0;
    engine.jump();
    expect(engine.pl.vy).toBe(0);
    expect(engine.pl.og).toBe(false);
  });

  it('jump does nothing when dying', () => {
    const engine = new GameEngine(noSync);
    engine.pl.og = true;
    engine.pl.dying = true;
    engine.jump();
    expect(engine.pl.og).toBe(true);
    expect(engine.pl.vy).toBe(0);
  });

  it('respawn resets player and sets gState to playing', () => {
    const onSync = vi.fn();
    const engine = new GameEngine(onSync);
    engine.pl.hp = 0;
    engine.pl.dying = true;
    engine.gState = 'gameover';
    engine.respawn();
    expect(engine.gState).toBe('playing');
    expect(engine.pl.hp).toBe(MAX_HP);
    expect(engine.pl.dying).toBe(false);
    expect(engine.pl.inv).toBeGreaterThan(0);
    expect(onSync).toHaveBeenCalled();
  });

  it('sync calls onSync with correct shape', () => {
    const onSync = vi.fn();
    const engine = new GameEngine(onSync);
    engine.sync();
    expect(onSync).toHaveBeenCalledWith(
      expect.objectContaining({
        state: 'title',
        score: 0,
        lives: MAX_LIVES,
        hp: MAX_HP,
        level: 1,
      })
    );
  });

  it('handleKey sets key state', () => {
    const engine = new GameEngine(noSync);
    engine.handleKey('ArrowLeft', true);
    expect(engine.keys['ArrowLeft']).toBe(true);
    engine.handleKey('ArrowLeft', false);
    expect(engine.keys['ArrowLeft']).toBe(false);
  });
});
