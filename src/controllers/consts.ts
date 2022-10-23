import { toCorrectLength } from './utils';

export const MenuInterface = (id: number, balance: number) => {
  return toCorrectLength([`Твій айді: ${id}`, `Твій баланс: ${balance}`]);
};
